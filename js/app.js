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

  // Map Elements
  const geoCard = document.getElementById('geoCard');
  const geoCoords = document.getElementById('geoCoords');
  let mapInstance = null;
  let mapMarker = null;

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
      // 5 stages × 500ms = exactly 2500ms (2.5 seconds)
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

    // SVGs
    const svgPin = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>`;
    
    const svgWarning = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>`;

    const svgShieldClean = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="M9 12l2 2 4-4"></path>
      </svg>`;

    // 4. Update the Left Summary Card
    if (data.totalCount > 0) {
      verdictIconContainer.innerHTML = data.location ? svgPin : svgWarning;
      verdictTitle.textContent = `Your photo leaks ${data.totalCount} hidden data points`;
      verdictSubtitle.textContent = data.location
        ? 'Precise GPS coordinates are embedded inside this photo.'
        : 'Hardware signatures and capture settings are fully exposed.';
      verdictSummaryCard.style.borderColor = 'rgba(255, 51, 102, 0.35)';
      verdictSummaryCard.style.background = 'rgba(255, 51, 102, 0.08)';
    } else {
      verdictIconContainer.innerHTML = svgShieldClean;
      verdictTitle.textContent = 'No EXIF metadata detected';
      verdictSubtitle.textContent = 'This file is clean. No hardware or location tracking markers were found.';
      verdictSummaryCard.style.borderColor = 'rgba(16, 185, 129, 0.35)';
      verdictSummaryCard.style.background = 'rgba(16, 185, 129, 0.08)';
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
      locationActionBtn.href = `https://www.google.com/maps?q=${lat},${lng}`;
      locationActionBtn.title = 'Open coordinates in Google Maps';

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

      // Show Map
      geoCard.classList.remove('hidden');
      geoCoords.textContent = `${data.location.lat.toFixed(5)}, ${data.location.lng.toFixed(5)}`;
      renderLeafletMap(data.location.lat, data.location.lng);

    } else {
      locationActionBtn.className = 'glass-card location-action-card loc-clean';
      locStatusTitle.innerHTML = `<span>NOT FOUND</span>`;
      locActionHint.textContent = 'Safe from tracking';
      locationActionBtn.removeAttribute('href');
      locationActionBtn.title = 'No GPS location embedded';

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

  function renderLeafletMap(lat, lng) {
    setTimeout(() => {
      if (!mapInstance) {
        mapInstance = L.map('mapContainer', { attributionControl: false }).setView([lat, lng], 14);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
          className: 'map-tiles-dark'
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

  // Scrub All & Download Clean Photo
  btnScrubAll.onclick = async () => {
    if (!activeFile) return;

    btnScrubAll.disabled = true;
    btnScrubAll.textContent = 'Scrubbing All Metadata...';

    try {
      const cleanBlob = await engine.scrubAll(activeFile);
      const cleanFilename = `clean_${activeFile.name.replace(/\.[^/.]+$/, '')}.jpg`;
      engine.triggerDownload(cleanBlob, cleanFilename);
    } catch (err) {
      console.error(err);
      alert('Error scrubbing metadata: ' + (err.message || String(err)));
    } finally {
      btnScrubAll.disabled = false;
      btnScrubAll.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        Scrub All Metadata & Download Clean
      `;
    }
  };
});