/* Obscape Quick Start: power-up simulator, error "Show me" playback, section highlighting.
   No tracking, no external requests. Sound only plays after a tap. */
(function () {
  "use strict";

  var PATTERNS = {};
  try { PATTERNS = JSON.parse(document.getElementById("patterns").textContent); } catch (e) {}

  /* ---------- Sound ---------- */
  var soundOn = true;
  var ctx = null;
  function audio() {
    if (!soundOn) return null;
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
    } catch (e) { return null; }
    return ctx;
  }
  function tone(ms, freq, delay) {
    var a = audio(); if (!a) return;
    var t = a.currentTime + (delay || 0) / 1000;
    var o = a.createOscillator(), g = a.createGain();
    o.type = "square"; o.frequency.value = freq || 2000;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
    g.gain.setValueAtTime(0.06, t + Math.max(ms / 1000 - 0.02, 0.012));
    g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + ms / 1000 + 0.02);
  }
  function tune() { [1047, 1319, 1568, 2093].forEach(function (f, i) { tone(140, f, i * 150); }); }

  /* ---------- Cancellable timeline ---------- */
  function Runner() { this.ids = []; }
  Runner.prototype.at = function (ms, fn) { this.ids.push(setTimeout(fn, ms)); };
  Runner.prototype.stop = function () { this.ids.forEach(clearTimeout); this.ids = []; };

  function setLed(el, colour) {
    if (!el) return;
    el.classList.remove("red", "blue", "green");
    if (colour) el.classList.add(colour);
  }

  /* Schedule an error pattern for n 2-second cycles from t0 (ms). Returns the end time. */
  function playPattern(run, led, id, cycles, t0) {
    var p = PATTERNS[id]; if (!p) return t0;
    for (var c = 0; c < cycles; c++) {
      var base = t0 + c * 2000;
      p.led.forEach(function (seg) {
        run.at(base + seg[0], function () { setLed(led, seg[2]); });
        run.at(base + seg[1] - 1, function () { setLed(led, null); });
      });
      p.beep.forEach(function (b) {
        run.at(base + b[0], function () { tone(b[1] - b[0], 2000); });
      });
    }
    return t0 + cycles * 2000;
  }

  /* Blink a colour n times (250 ms on, 250 ms off) from t0. */
  function blink(run, led, colour, n, t0) {
    for (var i = 0; i < n; i++) {
      (function (k) {
        run.at(t0 + k * 500, function () { setLed(led, colour); });
        run.at(t0 + k * 500 + 250, function () { setLed(led, null); });
      })(i);
    }
    return t0 + n * 500;
  }

  var active = null; // one thing plays at a time
  function stopAll() {
    if (active) { active.stop(); active = null; }
    document.querySelectorAll("[data-led]").forEach(function (l) { setLed(l, null); });
    document.querySelectorAll(".err.flash").forEach(function (e) { e.classList.remove("flash"); });
  }

  /* ---------- Error cards: Show me ---------- */
  document.querySelectorAll(".err [data-show]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".err");
      var led = card.querySelector("[data-led]");
      stopAll(); audio();
      var run = new Runner(); active = run;
      card.classList.add("flash");
      var end = playPattern(run, led, card.getAttribute("data-pattern"), 3, 0);
      run.at(end, function () { card.classList.remove("flash"); setLed(led, null); active = null; });
    });
  });

  /* ---------- Power-up simulator ---------- */
  document.querySelectorAll("[data-sim]").forEach(function (sim) {
    var led = sim.querySelector("[data-led]");
    var bar = sim.querySelector("[data-bar]");
    var oled = sim.querySelector("[data-oled]");
    var status = sim.querySelector("[data-sim-status]");
    var fault = sim.querySelector("[data-sim-fault]");
    var soundBtn = sim.querySelector("[data-sim-sound]");
    var checks = Array.prototype.slice.call(sim.querySelectorAll("[data-check]"));

    function say(h) { status.innerHTML = h; }
    function reset() {
      checks.forEach(function (li) { li.className = ""; });
      bar.style.width = "0"; oled.textContent = "Off"; setLed(led, null);
    }

    soundBtn.addEventListener("click", function () {
      soundOn = !soundOn;
      soundBtn.setAttribute("aria-pressed", String(soundOn));
      soundBtn.textContent = soundOn ? "Sound on" : "Sound off";
    });

    sim.querySelector("[data-sim-start]").addEventListener("click", function () {
      stopAll(); reset(); audio();
      var run = new Runner(); active = run;
      var bad = fault.value, failIndex = -1;
      checks.forEach(function (li, i) { if (li.getAttribute("data-check") === bad) failIndex = i; });
      var STEP = 1400, T = 4000;

      // 1. Beep, then blue blinking for 4 seconds
      run.at(0, function () {
        tone(180, 2000); oled.textContent = "Starting";
        say("Beep. The status LED <strong>blinks blue for 4 seconds</strong>.");
      });
      blink(run, led, "blue", 8, 0);

      // 2. Solid blue while the self-test runs
      run.at(T, function () {
        setLed(led, "blue");
        say("LED <strong>solid blue</strong>. The self-test is running (1 to 2 minutes in real life).");
      });
      var last = failIndex >= 0 ? failIndex : checks.length - 1;
      for (var k = 0; k <= last; k++) {
        (function (i) {
          var li = checks[i];
          run.at(T + i * STEP, function () {
            li.className = "run"; oled.textContent = li.textContent;
            bar.style.width = Math.round((i / checks.length) * 100) + "%";
          });
          if (i !== failIndex) run.at(T + i * STEP + 900, function () { li.className = "ok"; });
        })(k);
      }

      // 3a. Fail: loop the error pattern
      if (failIndex >= 0) {
        var failAt = T + failIndex * STEP + 900;
        run.at(failAt, function () {
          var li = checks[failIndex];
          li.className = "bad"; setLed(led, null);
          oled.textContent = "Error: " + li.textContent;
          var name = fault.options[fault.selectedIndex].text;
          say("Self-test <strong>failed: " + name + "</strong>. The LED and buzzer repeat this pattern until you switch off. <a href=\"#err-" + bad + "\">See the fix</a>");
          var card = document.getElementById("err-" + bad);
          if (card) card.classList.add("flash");
        });
        var end = playPattern(run, led, bad, 4, failAt + 300);
        run.at(end, function () { setLed(led, null); active = null; });
        return;
      }

      // 3b. Pass: green blink + tune, then dark
      var t = T + checks.length * STEP;
      run.at(t, function () {
        bar.style.width = "100%"; oled.textContent = "Test passed";
        say("<strong>Passed.</strong> The LED blinks green and the buzzer plays the acknowledgement tune.");
        tune();
      });
      t = blink(run, led, "green", 4, t) + 400;
      run.at(t, function () {
        setLed(led, null); oled.textContent = "Measuring";
        say("<strong>All good.</strong> The LED now stays off while the unit measures. That's normal.");
        active = null;
      });
    });
  });

  /* ---------- Highlight the chip for the section in view ---------- */
  var chips = document.querySelectorAll(".chips a");
  if (chips.length && "IntersectionObserver" in window) {
    var byId = {};
    chips.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && byId[e.target.id]) {
          chips.forEach(function (a) { a.classList.remove("on"); });
          var on = byId[e.target.id]; on.classList.add("on");
          var bar = on.parentElement;
          bar.scrollTo({ left: on.offsetLeft - bar.clientWidth / 2 + on.clientWidth / 2 });
        }
      });
    }, { rootMargin: "-120px 0px -60% 0px" });
    document.querySelectorAll("main > section.card").forEach(function (s) { io.observe(s); });
  }
})();
