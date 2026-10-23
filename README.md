# Obscape Quick Start: scan-to-learn device guides

Phone-friendly guides reached by scanning QR stickers on Obscape devices. The first version is for **IMESA 2026** (Stand 50, Hall 2, ICC Durban, 28 to 30 Oct). Tuesday 27 Oct is the stand build, so the stickers need to be on the devices by Monday evening.

| Page | Covers | Sticker(s) |
|---|---|---|
| `/` | Hub: all devices | `hub`, for the stand counter |
| `/ptm/` | PTM gauges (level, rain, flow) | `ptm-open` on the back panel, `ptm-power` on the side |
| `/wx/` | Weather station (PTM + ATMOS 41) | `wx-sensor` on the pole, `wx-open` on the PTM back |
| `/cam/` | F12 MP Time-Lapse Camera | `cam-open` on the back, `cam-guide` on the side |
| `/buoy/` | OBS-BUOY 7W | `buoy-open` and `buoy-power` on the top disc |

Each device page covers: how to open it, what's inside (parts A to G), battery, SIM and SD card, a **power-up simulator** (tap to see and hear a healthy start or any fault), an **LED and beep error decoder**, closing up, and mounting.

---

## 1. Go live on GitHub Pages (Friday, about 10 minutes, on a PC)

**What this does:** it creates a new public website, hosted free by GitHub. Nothing on Obscape's own servers, website or SharePoint changes. The pages only contain information that is already in Obscape's published manuals.

1. Sign in to **github.com** as **Delta-Obs**. The QR codes point to **https://delta-obs.github.io**, so this account is the one to use.
2. Click **+** (top right), then **New repository**.
   - Name it exactly **`delta-obs.github.io`** (your username, in lower case, followed by `.github.io`).
   - Set it to **Public**.
   - Click **Create repository**.
3. On the new repository page, click **uploading an existing file**. Unzip `obscape-quickstart-site.zip` and drag **everything inside it** (files and folders) into the browser window. Click **Commit changes**.
4. Go to **Settings**, then **Pages**. Check that the source is **Deploy from a branch**, with branch **main** and folder **/ (root)**.
5. Wait 1 to 2 minutes, then open **https://delta-obs.github.io** on your phone. Then scan one of the printed proof stickers to check the whole chain works.

**To update later:** upload the new files the same way. They replace the old ones and go live within a minute or two.

## 2. Photos (Friday)

The pages already work without photos. Each photo appears automatically once it is uploaded. Take them landscape, on a plain background, with good light.

The **PTM set covers three pages** (PTM gauges, Weather Station and Camera all use the same housing).

**PTM housing → `img/ptm/`**
- [ ] `hero.jpg`: front three-quarter view of a PTM gauge, solar panels visible
- [ ] `back_bolts.jpg`: flat screwdriver undoing one of the 2 nylon bolts on the back
- [ ] `back_slit_twist.jpg`: screwdriver tip in a side slit, turned 90°, panel lifting
- [ ] `back_open.jpg`: back panel off, control panel visible
- [ ] `control_panel.jpg`: square-on, evenly lit shot of the whole control panel (parts A to G)
- [ ] `battery.jpg`: button-top 18650 in its clip, + end to the top, polarity mark readable
- [ ] `sim_sd.jpg`: SIM and SD sockets close up
- [ ] `oring_grease.jpg`: fingertip greasing the O-ring
- [ ] `brackets.jpg`: back of the unit with both brackets fitted

**Camera → `img/cam/`**
- [ ] `hero.jpg`: front three-quarter view showing the lens window
- [ ] `lens_foil.jpg`: peeling the clear foil off the lens window (staged is fine)

**Weather station → `img/wx/`**
- [ ] `full_pole.jpg`: the whole station on its 1 m pole
- [ ] `vbolt.jpg`: the ATMOS 41 V-bolt bracket clamped on top of the pole
- [ ] `north.jpg`: the engraved N on the sensor, with a phone compass beside it
- [ ] `level.jpg`: the bubble level under the sensor, bubble centred

**Wave buoy → `img/buoy/`**
- [ ] `hero.jpg`: the buoy from a three-quarter angle
- [ ] `eye_bolts.jpg`: top view, 3 eye bolts with split pins
- [ ] `eye_bolt_lever.jpg`: screwdriver through an eye bolt, used as a lever
- [ ] `hex_bolts.jpg`: no. 5 allen key in one of the 2 hex bolts
- [ ] `back_panel_lift.jpg`: screwdriver turned in the groove, panel lifting
- [ ] `control_panel.jpg`: square-on shot of the buoy's control panel
- [ ] `battery.jpg`: battery in its holder, polarity readable
- [ ] `oring.jpg`: greasing the O-ring
- [ ] `split_pins.jpg`: split pin through an eye bolt, legs bent outwards

⚠ Keep the **activation key label** out of every shot, or blur it.

Send the photos to Claude (named as above, in the four folders). `tools/photos.py` resizes them and strips GPS and other metadata. You then upload the `img/` folder to GitHub.

## 3. Print the stickers (Monday, Brother QL-800)

1. **Test first:** print `labels/proof_A4.pdf` on any office printer at **100% / actual size**, and scan every sticker with your phone.
2. Load the **DK-11221 23 mm x 23 mm** paper labels in the QL-800.
3. Open `labels/labels.pdf` and print to the QL-800.
   - In **Printer properties**, set the paper to **23 mm x 23 mm**.
   - Set the scale to **Actual size** (not "fit").
   - Each page is one sticker. Print the pages you need, with the copies you need.
4. **Or use P-touch Editor:** make a new 23 x 23 mm label, insert the sticker's `.png` as a picture, and set it to 23 x 23 mm.
5. **Before sticking:** wipe the spot with an alcohol wipe. Keep stickers off the solar panels, the lens window, the bolts and the back-panel seam.

Paper labels are fine for the stand. For units going to the field, the next step is laminated tape or a laser-etched tag.

## 4. Check before Tuesday

The manuals disagree with each other on these points. The site uses the version shown below in bold; someone who knows the firmware should confirm it.

- [ ] **"Could not connect to server":** the error tables in all three manuals say **steady red LED**, but the footnotes say steady blue.
- [ ] **SIM error beeps:** the buoy and camera manuals say the **slow beep comes with the red flash, and the SIM PIN double beep with the blue flash**. The PTM manual says blue and green.
- [ ] **Camera on the stand:** is it the **F12 MP** (the page is written for it) or the 5 MP?
- [ ] **Weather station wiring:** the Obscape manual says brown = VCC, white = SDI, black = GND; METER's own colours differ. This step is folded away on the page and marked "usually done in the workshop".
- [ ] Turn the IMESA banner off after the show: set `event: show: false` in `content/site.yml` and rebuild.

---

## Editing (for whoever maintains this)

- Text lives in `content/*.yml`.
  - `shared.yml` holds the PTM-housing steps used by three devices.
  - Each device file lists its sections and its own wording (`vars`).
- Page layout is in `templates/`, styles in `assets/style.css`, and the simulator in `assets/app.js`.
- Rebuild the pages: `python3 build.py`
- New stickers for a different web address: `python3 tools/labels.py https://ADDRESS`
- Import photos: `python3 tools/photos.py <folder>`
- The only outside request is Google Fonts (Archivo and Nunito Sans, as in the house style); without it the pages fall back to system fonts. No tracking. Printing a page gives a clean paper quick-start sheet.
