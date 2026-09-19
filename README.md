# SPECTRA // Forensic Privacy Lens

A high-performance, client side EXIF inspection and metadata sanitizer designed with an editorial, cyber forensic glassmorphism interface.

SPECTRA audits what your photos are leaking including hardware serials, device fingerprints, exposure settings, and satellite GPS coordinates and allows you to strip all metadata segments directly inside browser memory before sharing online.

---

## Key Features

- **100% Client-Side Privacy:** Operates entirely within your browser's local sandbox memory. Zero images, EXIF chunks, or coordinates are ever uploaded to an external server.
- **Deep Forensic Telemetry:** Decodes and categorizes hidden photo data into clear inspector blocks:
  - **Device:** Manufacturer, Model, OS/Firmware version.
  - **Capture:** Normalized 12-hour timestamps (`hh:mm a | Do MMMM, YYYY`), pixel dimensions, and orientation.
  - **Camera Settings:** Aperture ($f$-number), shutter speed, ISO rating, focal length, 35mm full-frame equivalent, flash status, white balance, and exposure mode.
  - **Location:** Latitude, longitude, altitude (in meters and feet), with an automatic filter ignoring `0, 0` Null Island coordinates.
- **One-Tap Google Maps Routing:** Detected GPS pins generate a direct satellite link that opens the precise coordinates in Google Maps.
- **Dark Matter Cartographic Preview:** Integrated Leaflet.js map layer displaying satellite pins with zero tracking and no API keys required.
- **Client-Side EXIF Stripper:** Draws images to an isolated HTML5 Canvas and exports fresh blobs, wiping 100% of EXIF, GPS, MakerNotes, XMP, and IPTC segments without dimension loss.
- **Responsive Mobile HUD:** Fluid single-column layout with tactile tap targets, laser scanline sweeps, and frosted glass cards (`backdrop-filter`).

---

## File Architecture

```text
spectra/
├── index.html              # UI layout, CDN imports, and telemetry markup
├── style.css               # Frosted glass styling, HUD animations, and responsive tokens
├── README.md               # Project documentation
└── js/
    ├── BaseProcessor.js    # ArrayBuffer utilities, file streams, and Blob downloaders
    ├── FeatureEngine.js    # ExifReader integration, tag normalization, and canvas sanitizer
    └── app.js              # State manager, 2.5s forensic scan loop, and map controller
```

---

## Technologies Used

- **HTML5 & Vanilla JavaScript (ES6+):** Modular, object-oriented processor classes without heavy build tools.
- **CSS3:** Native CSS variables, keyframe animations, and multi-layer backdrop blurs.
- **[ExifReader](https://github.com/mattiasw/ExifReader):** Fast client-side EXIF, IPTC, and XMP parser.
- **[Leaflet.js](https://leafletjs.com/):** Lightweight mobile-friendly interactive mapping.
- **CartoDB Voyager (Inverted):** Dark-mode map tile provider.

---

## Author

Designed & Developed by **[Sayan Roy](https://beacons.ai/sayan_roy0009)**