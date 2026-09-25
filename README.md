# 🌍 Celestial Observer: Globe vs. Flat Earth Simulation

Welcome to **Celestial Observer**! This is an interactive 3D virtual physics and astronomy laboratory designed to explore, test, and compare the **Globe Model** and the **Flat Earth Model** side by side using real mathematics, 3D graphics, and optics.

Whether you want to test over-the-horizon water curvature, examine how sunsets work under different models, watch seasonal sun tracks, or inspect the celestial sphere through a virtual telescope, this tool gives you complete freedom to experiment with every variable.

---

## ⚡ Quick Start (Easiest Way — No Tech Experience Needed)

If you have downloaded this folder on a Windows computer, you do **not** need to be a programmer or know how to code to run it!

### The 1-Click Launch:
1. Open this project folder in your Windows File Explorer.
2. Find the file named **`run_simulation.bat`** and **double-click it**.
3. A small window will appear, and your default web browser (Chrome, Edge, Firefox, etc.) will **automatically open** to the simulation!
4. When you are done, simply close your browser tab and close the small window.

> **Tip: Install as a Desktop App!**  
> Once the simulation is open in Google Chrome or Microsoft Edge, look at the right side of the address bar at the top of the browser. Click the little **"Install app"** or **computer monitor icon**. Windows will install it as a regular standalone app with its own desktop shortcut!

---

## 🛠️ Installation Guide (If Setting Up on a Fresh Computer)

If you are setting this up on a brand new computer or sharing it with a friend, follow these simple steps:

### Option A: The Fast 2-Minute Setup (Recommended)
1. **Make sure you have Python installed:**
   - Go to [python.org/downloads](https://www.python.org/downloads/) and click the yellow **"Download Python"** button (or install Python from the free Microsoft Store on Windows).
   - *Important during install:* Check the little box that says **"Add Python to PATH"**.
2. **Double-click `run_simulation.bat`** inside this folder.
   - The simulation will open in your browser immediately.

---

### Option B: For Developers (Running from Source Code with Flutter)
If you want to edit the Dart source code and recompile:
1. **Install Flutter:**
   - Download the Flutter SDK from [flutter.dev](https://docs.flutter.dev/get-started/install/windows).
   - Extract it to `C:\flutter` and add `C:\flutter\bin` to your system environment variables.
2. **Open a Terminal / PowerShell in this folder:**
   ```bash
   # Run the app locally in Chrome with hot reload:
   flutter run -d chrome

   # Or compile a fresh release web build:
   flutter build web --release
   ```

---

## 🧭 How the Program Works

The simulation is split into two synchronized systems running simultaneously:
1. **A Flutter Web Interface:** Powers all the buttons, sliders, time scrubbers, drawer menus, and the live telemetry HUD overlay.
2. **A Three.js WebGL 3D Engine:** A hardware-accelerated 3D graphics engine running inside your browser that accurately calculates lighting, orbital paths, camera optics, spherical curvature, and atmospheric fog.

---

## 🔭 The Two Viewing Perspectives

At the top of the screen, you can switch between two completely different perspectives:

### 1. 👁️ Skywatcher Mode (First-Person View)
* You stand directly on the surface of the Earth at your chosen latitude and longitude.
* **Look Around:** Click and drag the sky to turn your head 360° (compass heading) and tilt your head up towards the stars or down towards the water horizon.
* **Telescope Scope Zoom:** Use the slider in the top bar or mouse wheel to zoom in smoothly from a **$50^\circ$ wide angle** all the way down to a **$1.5^\circ$ extreme telephoto scope ($33\times$ to $60\times$ zoom)**. This allows you to inspect distant pylons or examine the Sun's disk with optical clarity.
* **Day Stars:** Toggle the "Day Stars" button to see the background constellations behind the Sun in broad daylight.

### 2. 🛰️ Orbit View (God's Eye View)
* Fly out into space to view the entire system from above.
* **Observer Pin:** A bright marker shows your exact location on the surface.
* **Celestial Bodies:** Watch the Sun and Moon move along their orbital paths, complete with a realistic day/night illumination cycle.
* **Focus Toggle:** Switch camera focus between the Sun and the Earth to watch orbital mechanics in action.

---

## 🔬 The Two Models: Globe vs. Flat Earth

You can toggle between the two models at any instant using the **Model Toggle** in the top bar:

### 🌐 The Globe Model
* **Geometry:** A rotating sphere with radius $R \approx 6,371\text{ km}$, tilted on its axis at $23.44^\circ$.
* **Day & Night:** Caused by the Earth rotating once every 24 hours relative to the Sun.
* **The Sun:** Placed at real astronomical scale ($149.6\text{ million km}$ away). Because it is so distant, its rays arrive essentially parallel.
* **Sunsets:** The Sun sinks smoothly **bottom-first below the physical curved horizon** created by the Earth's curvature. Its apparent visual size stays constant all day ($\approx 0.533^\circ$).
* **Angular Speed:** Moves across the sky at a steady $\approx 15^\circ$ of hour angle per hour ($15.0''/\text{s}$).

### 🗺️ The Flat Earth Model (Gleason Monopole Disk)
* **Geometry:** A flat circular disk with a radius of $20,000\text{ km}$, centered on the North Pole and bounded by an outer Antarctic ice wall, matching Alexander Gleason's 1892 *Standard Map of the World*.
* **The Sun:** A local light source ($\approx 4,828\text{ km} / 3,000\text{ miles}$ high and $\approx 51.5\text{ km} / 32\text{ miles}$ in diameter) circling clockwise above the disk once every 24 hours. In June, it circles the inner Tropic of Cancer; in December, it circles the outer Tropic of Capricorn.
* **The 3 Sunset Options:** In the Variables Drawer, you can choose how the local sun behaves:
  1. **Pure Geometry:** Standard line-of-sight optics. Because the Sun is 3,000 miles high, it stays above the horizon 24 hours a day, circling overhead.
  2. **Directional Spotlight:** The Sun shines downward like a flashlight cone with a limited beam angle. When it circles away from you, you enter darkness.
  3. **Volumetric Fog (Atmospheric Extinction):** The atmosphere gradually dims, reddens, and fades out the Sun as distance increases, extinguishing it at your configured visibility cutoff distance.
* **Angular Size & Speed Changes:** Because the local Sun moves much closer to you at solar noon and much farther away at sunrise/sunset, its apparent angular diameter shrinks as it recedes, and its apparent speed across your sky changes dynamically ($25^\circ\text{–}35^\circ/\text{h}$ at noon down to $<10^\circ/\text{h}$ near the horizon).

---

## 🌊 Over-the-Horizon Curvature Experiments

Click the **Variables** button in the top right, expand the **Curvature & Horizon Experiment** card, and turn on **Show Curvature Targets**:

### ⚡ Lake Pontchartrain Multi-Pylon Curvature Test
* Inspired by the famous transmission line observations across Lake Pontchartrain, Louisiana.
* Places **9 identical 45-meter-tall transmission pylons** spaced 3 km apart across 27 km of open water, connected by 6 continuous power cables.
* **On Globe:** The water surface follows the physical curvature of the Earth ($y = -h_{\text{cam}} - \frac{d^2}{2R}$). As you look down the line through the scope zoom, the water bulges upward between you and the pylons: the distant tower bases and lower crossarms **sink progressively beneath the water horizon**.
* **On Flat Earth:** The water is mathematically level ($y = -h_{\text{cam}}$ everywhere). Looking down the transmission line, **all 9 pylon bases remain visible in a straight perspective line** sitting directly on top of the water.

### 🏛️ The Survey Monolith Test
* A customizable survey monolith with alternating high-contrast 10-meter colored bands and bold meter labels (`0m`, `10m`, `20m`, etc.).
* Positioned across the water at any distance you choose (1 km to 50 km).
* On the Globe model, the foreground water horizon cleanly occludes the lower markings, allowing you to visually verify the geometric curvature drop:
  $$h_{\text{hidden}} = \frac{(d - d_{\text{horizon}})^2}{2 R}$$

### 🎯 `[Align Camera to Target]` & 0° Eye-Level Laser
* **Snap to Target:** Clicking the button instantly aims your camera dead-level ($0.00^\circ$ pitch) directly at the pylons or monolith.
* **Eye-Level Reticle (0° Cyan Laser):** Turns on an electric-cyan horizontal reference line. On the Globe, you can directly see the **Horizon Dip** angle (the water horizon sits slightly *below* true eye level, dipping lower as your camera elevation increases).

---

## ⏱️ Time Machine & Daily Timelapse Controls

Located in the bottom control bar:
* **Play / Pause & Scrubber:** Drag the time slider to scrub through the day.
* **Simulation Speed:** Type any number to speed up time (e.g. `60` = 1 minute per second; `3600` = 1 hour per second).
* **Daily Timelapse Mode (1s/day):** 
  - Switch from continuous time to **Daily Timelapse**.
  - Time jumps forward exactly **24 hours per step**, locking the clock at the exact same hour of the day (e.g. 12:00 noon every day).
  - This lets you watch the Sun migrate north and south between solstices and trace its famous **figure-8 Analemma** in the sky!
* **Quick Season Buttons:** Instant 1-click jumps to the **March Equinox**, **June Solstice**, **September Equinox**, and **December Solstice**.

---

## 📊 Understanding the Telemetry HUD

The floating HUD in the top left provides live scientific readouts updated every single frame:

| Metric | What It Means in Plain English |
| :--- | :--- |
| **Azimuth / Altitude** | The exact compass heading ($0^\circ = \text{North}, 90^\circ = \text{East}$) and vertical angle above ($+$) or below ($-$) the horizon. |
| **Distance** | The straight-line distance from your eyes to the center of the Sun or Moon. |
| **Angular Diameter** | How large the Sun appears in degrees and arcminutes. *(The human eye sees the Sun as roughly $0.53^\circ$ or 32 arcminutes wide).* |
| **Angular Speed** | How fast the Sun sweeps across the sky in degrees per hour and arcseconds per second. |
| **Horizon Distance** | The geometric distance to the horizon line based on your camera elevation above sea level. |
| **Horizon Dip** | The angle by which the horizon drops below true $0.00^\circ$ astronomical eye level due to Earth's curvature. |
| **Hidden / Visible Height** | How many meters of the distant monolith or pylons are submerged below the horizon bulge versus visible to your lens. |

---

## ⚙️ Fully Customizable: The Anti-Strawman Guarantee

Every single physical parameter in the simulation can be customized in the **Variables Drawer** (`Variables` button in the top right):
* **Observer Latitude & Longitude** (stand anywhere on Earth).
* **Observer Elevation** (from 0.1 meters at water level up to 400 km in orbit).
* **Earth Radius** (tweak the planetary radius).
* **Flat Earth Disk Radius & Sun Height** (adjust disk boundaries and sun altitude).
* **Spotlight Beam Angle & Fog Distance** (fine-tune flat earth atmospheric models).
* **Reset Button:** Whenever you want to return to standard real-world baseline values, just click **"Reset"**!

---

## 📄 License & Credits
Built with [Flutter Web](https://flutter.dev) and [Three.js](https://threejs.org).  
Texture maps courtesy of NASA Visible Earth (Blue Marble series).  
Map projection based on Alexander Gleason's 1892 *Standard Map of the World*.
