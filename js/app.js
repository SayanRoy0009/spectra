document.addEventListener('DOMContentLoaded', () => {
  const engine = new FeatureEngine();

  // DOM Elements
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const dropContent = document.getElementById('dropContent');
  const previewBox = document.getElementById('previewBox');
  const imagePreview = document.getElementById('imagePreview');
  const btnReplace = document.getElementById('btnReplace');

  // Scanner Elements
  const scanSection = document.getElementById('scanSection');
  const scanPct = document.getElementById('scanPct');
  const scanLogs = document.getElementById('scanLogs');
  const progressBar = document.getElementById('progressBar');

  // Results & Dual Cards
  const resultsSection = document.getElementById('resultsSection');
  const verdictSummaryCard = document.getElementById('verdictSummaryCard');
  const verdictIconContainer = document.getElementById('verdictIconContainer');
  const verdictTitle = document.getElementById('verdictTitle');
  const verdictSubtitle = document.getElementById('verdictSubtitle');

  const locationActionBtn = document.getElementById('locationActionBtn');
  const locStatusTitle = document.getElementById('locStatusTitle');
  const locActionHint = document.getElementById('locActionHint');

  // Categorized Spec Elements
  const specMake = document.getElementById('specMake');
  const specModel = document.getElementById('specModel');
  const specSoftware = document.getElementById('specSoftware');

  const specDateTime = document.getElementById('specDateTime');
  const specWidth = document.getElementById('specWidth');
  const specHeight = document.getElementById('specHeight');
  const specOrientation = document.getElementById('specOrientation');

  const specAperture = document.getElementById('specAperture');
  const specShutter = document.getElementById('specShutter');
  const specISO = document.getElementById('specISO');
  const specFocal = document.getElementById('specFocal');
  const spec35mm = document.getElementById('spec35mm');
  const specFlash = document.getElementById('specFlash');
  const specWB = document.getElementById('specWB');
  const specExposureProgram = document.getElementById('specExposureProgram');

  const specLat = document.getElementById('specLat');
  const specLng = document.getElementById('specLng');
  const specAlt = document.getElementById('specAlt');

  // Map Elements & Dual Floating Controls
  const geoCard = document.getElementById('geoCard');
  const geoCoords = document.getElementById('geoCoords');
  const floatMapBtn = document.getElementById('floatMapBtn');
  const mapThemeToggle = document.getElementById('mapThemeToggle');
  const mapThemeIcon = document.getElementById('mapThemeIcon');
  const mapThemeLabel = document.getElementById('mapThemeLabel');

  let mapInstance = null;
  let mapTileLayer = null;
  let mapMarker = null;
  let isMapDark = true; // Dark mode default

  // Buttons & Raw Table
  const btnScrubAll = document.getElementById('btnScrubAll');
  const rawTableBody = document.getElementById('rawTableBody');

  let activeFile = null;

  // Upload Handlers
  dropZone.onclick = (e) => {
    if (e.target !== btnReplace && !btnReplace.contains(e.target)) fileInput.click();
  };

  btnReplace.onclick = (e) => {
    e.stopPropagation();
    fileInput.click();
  };

  fileInput.onchange = (e) => e.target.files[0] && handleUpload(e.target.files[0]);

  dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  };
  dropZone.ondragleave = () => dropZone.classList.remove('drag-over');
  dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files?.length) handleUpload(e.dataTransfer.files[0]);
  };

  async function handleUpload(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, HEIC, TIFF).');
      return;
    }

    activeFile = file;

    // Show Preview
    imagePreview.src = URL.createObjectURL(file);
    dropContent.classList.add('hidden');
    previewBox.classList.remove('hidden');

    // Launch 2.5-Second Dramatic Forensic Animation
    resultsSection.classList.add('hidden');
    scanSection.classList.remove('hidden');

    await runScanAnimation();

    try {
      const data = await engine.inspect(file);
      renderForensics(data);
    } catch (err) {
      console.error(err);
      alert('Could not parse metadata: ' + (err.message || String(err)));
    } finally {
      scanSection.classList.add('hidden');
      resultsSection.classList.remove('hidden');
    }
  }

  // Exact 2.5-Second Progressive Forensic Scan Sequence
  function runScanAnimation() {
    return new Promise((resolve) => {
      const stages = [
        { pct: 15, log: '> Interrogating binary frame headers...' },
        { pct: 40, log: '> Scanning IFD0 & Exif SubIFD tables...' },
        { pct: 65, log: '> Decoding satellite GPS & telemetry tags...' },
        { pct: 88, log: '> Extracting hardware profiles & serials...' },
        { pct: 100, log: '> Forensic inspection complete. Assembling HUD...' }
      ];

      let i = 0;
      const interval = setInterval(() => {
        const step = stages[i];
        scanPct.textContent = `${step.pct}%`;
        progressBar.style.width = `${step.pct}%`;
        scanLogs.innerHTML = `<div class="log-line active">${step.log}</div>`;

        i++;
        if (i >= stages.length) {
          clearInterval(interval);
          setTimeout(resolve, 300);
        }
      }, 500);
    });
  }

  function renderForensics(data) {
    // 1. Device Block
    specMake.textContent = data.device.make || 'Not Disclosed';
    specModel.textContent = data.device.model || 'Not Disclosed';
    specSoftware.textContent = data.device.software || 'Not Disclosed';

    // 2. Capture Block
    specDateTime.textContent = data.capture.datetime || 'Not Disclosed';
    specWidth.textContent = data.capture.width ? `${data.capture.width} px` : '—';
    specHeight.textContent = data.capture.height ? `${data.capture.height} px` : '—';
    specOrientation.textContent = data.capture.orientation || '—';

    // 3. Camera Settings Block
    specAperture.textContent = data.cameraSettings.aperture || '—';
    specShutter.textContent = data.cameraSettings.shutter || '—';
    specISO.textContent = data.cameraSettings.iso ? `ISO ${data.cameraSettings.iso}` : '—';
    specFocal.textContent = data.cameraSettings.focalLength || '—';
    spec35mm.textContent = data.cameraSettings.focalLength35mm || '—';
    specFlash.textContent = data.cameraSettings.flash || '—';
    specWB.textContent = data.cameraSettings.whiteBalance || '—';
    specExposureProgram.textContent = data.cameraSettings.exposureProgram || '—';

    // High-Contrast Cyan Info (i) Icon
    verdictIconContainer.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    `;

    // 4. Update the Left Summary Card
    if (data.totalCount > 0) {
      verdictTitle.innerHTML = `Your photo <span class="leak-highlight">leaks ${data.totalCount}</span> hidden data points`;
      verdictSubtitle.textContent = data.location
        ? 'Precise GPS coordinates are embedded inside this photo.'
        : 'Hardware signatures and capture settings are fully exposed.';
    } else {
      verdictTitle.innerHTML = 'No EXIF metadata detected';
      verdictSubtitle.textContent = 'This file is clean. No hardware or location tracking markers were found.';
    }

    // 5. Update the Right Location Button Card
    if (data.location) {
      locationActionBtn.className = 'glass-card location-action-card loc-revealed';
      locStatusTitle.innerHTML = `
        <span>REVEALED</span>
        <svg style="width:13px;height:13px;display:inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      `;
      locActionHint.textContent = 'Open in Google Maps →';
      
      const lat = data.location.lat.toFixed(6);
      const lng = data.location.lng.toFixed(6);
      const gmapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

      locationActionBtn.href = gmapsUrl;
      locationActionBtn.title = 'Open coordinates in Google Maps';

      // Update the floating button on the map
      if (floatMapBtn) {
        floatMapBtn.href = gmapsUrl;
      }

      // Update Spec List
      specLat.textContent = lat;
      specLng.textContent = lng;
      specLat.classList.add('highlight');
      specLng.classList.add('highlight');

      const hasValidAlt = data.location.altitude && data.location.altitude !== 'No altitude data recorded';
      specAlt.textContent = data.location.altitude;
      if (hasValidAlt) {
        specAlt.classList.add('highlight');
      } else {
        specAlt.classList.remove('highlight');
      }

      // Show Map Section & Render Square Map
      geoCard.classList.remove('hidden');
      geoCoords.textContent = `${data.location.lat.toFixed(5)}, ${data.location.lng.toFixed(5)}`;
      renderLeafletMap(data.location.lat, data.location.lng);

    } else {
      locationActionBtn.className = 'glass-card location-action-card loc-clean';
      locStatusTitle.innerHTML = `<span>NOT FOUND</span>`;
      locActionHint.textContent = 'Safe from tracking';
      locationActionBtn.removeAttribute('href');
      locationActionBtn.title = 'No GPS location embedded';

      if (floatMapBtn) {
        floatMapBtn.removeAttribute('href');
      }

      // Update Spec List
      specLat.textContent = 'Not Disclosed';
      specLng.textContent = 'Not Disclosed';
      specAlt.textContent = 'No altitude data recorded';
      specLat.classList.remove('highlight');
      specLng.classList.remove('highlight');
      specAlt.classList.remove('highlight');

      // Hide Map
      geoCard.classList.add('hidden');
    }

    // 6. Populate Deduplicated Raw Table
    rawTableBody.innerHTML = '';
    data.dedupedRawTags.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${item.tag}</td><td>${item.value}</td>`;
      rawTableBody.appendChild(row);
    });
  }

  // Render Leaflet Map
  function renderLeafletMap(lat, lng) {
    setTimeout(() => {
      if (!mapInstance) {
        mapInstance = L.map('mapContainer', { attributionControl: false }).setView([lat, lng], 14);
        
        mapTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          maxZoom: 19,
          className: isMapDark ? 'map-tiles-dark' : 'map-tiles-light'
        }).addTo(mapInstance);

        const pinIcon = L.divIcon({
          className: 'custom-map-pin',
          html: '<div class="pin-pulse"></div><div class="pin-point"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        mapMarker = L.marker([lat, lng], { icon: pinIcon }).addTo(mapInstance);
      } else {
        mapInstance.setView([lat, lng], 14);
        mapMarker.setLatLng([lat, lng]);
        mapInstance.invalidateSize();
      }
    }, 150);
  }

  // Floating Dark / Light Mode Toggle Button
  mapThemeToggle.onclick = () => {
    isMapDark = !isMapDark;

    const sunSvg = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;

    const moonSvg = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;

    if (isMapDark) {
      mapThemeIcon.innerHTML = sunSvg;
      mapThemeLabel.textContent = 'Light Mode';
    } else {
      mapThemeIcon.innerHTML = moonSvg;
      mapThemeLabel.textContent = 'Dark Mode';
    }

    if (mapTileLayer && mapTileLayer.getContainer()) {
      const container = mapTileLayer.getContainer();
      if (isMapDark) {
        container.classList.remove('map-tiles-light');
        container.classList.add('map-tiles-dark');
      } else {
        container.classList.remove('map-tiles-dark');
        container.classList.add('map-tiles-light');
      }
    }
  };

  // Scrub All & Download Clean Photo
  btnScrubAll.onclick = async () => {
    if (!activeFile) return;

    btnScrubAll.disabled = true;
    const labelSpan = btnScrubAll.querySelector('.btn-clean-label');
    if (labelSpan) labelSpan.textContent = 'Scrubbing All Metadata...';

    try {
      const cleanBlob = await engine.scrubAll(activeFile);
      const cleanFilename = `clean_${activeFile.name.replace(/\.[^/.]+$/, '')}.jpg`;
      engine.triggerDownload(cleanBlob, cleanFilename);
    } catch (err) {
      console.error(err);
      alert('Error scrubbing metadata: ' + (err.message || String(err)));
    } finally {
      btnScrubAll.disabled = false;
      if (labelSpan) labelSpan.textContent = 'Scrub All Metadata & Download Clean';
    }
  };
});