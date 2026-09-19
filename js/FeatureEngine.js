class FeatureEngine extends BaseProcessor {
  constructor() {
    super();
  }

  resolveReader() {
    if (typeof window.ExifReader !== 'undefined') {
      return window.ExifReader.load ? window.ExifReader : window.ExifReader.default;
    }
    if (typeof globalThis.ExifReader !== 'undefined') {
      return globalThis.ExifReader.load ? globalThis.ExifReader : globalThis.ExifReader.default;
    }
    return null;
  }

  async inspect(file) {
    const reader = this.resolveReader();
    if (!reader) {
      throw new Error('ExifReader library not found. Check your connection or script tag.');
    }

    const arrayBuffer = await this.readFileAsArrayBuffer(file);
    const tags = reader.load(arrayBuffer, { expanded: true });

    // Deduplicate tags for raw table presentation
    const cleanRawTags = this.deduplicateTags(tags);

    return {
      totalCount: cleanRawTags.length,
      device: {
        make: tags.exif?.Make?.description || tags.file?.Make?.description || null,
        model: tags.exif?.Model?.description || tags.file?.Model?.description || null,
        software: tags.exif?.Software?.description || tags.file?.Software?.description || null
      },
      capture: {
        datetime: this.parseDate(tags),
        width: tags.file?.['Image Width']?.value || tags.exif?.PixelXDimension?.value || null,
        height: tags.file?.['Image Height']?.value || tags.exif?.PixelYDimension?.value || null,
        orientation: tags.exif?.Orientation?.description || tags.file?.Orientation?.description || 'Normal'
      },
      cameraSettings: {
        aperture: tags.exif?.FNumber?.description || tags.exif?.ApertureValue?.description || null,
        shutter: tags.exif?.ExposureTime?.description || tags.exif?.ShutterSpeedValue?.description || null,
        iso: tags.exif?.ISOSpeedRatings?.description || null,
        focalLength: tags.exif?.FocalLength?.description || null,
        focalLength35mm: tags.exif?.FocalLengthIn35mmFilm?.description || null,
        flash: tags.exif?.Flash?.description || null,
        whiteBalance: tags.exif?.WhiteBalance?.description || null,
        exposureProgram: tags.exif?.ExposureProgram?.description || tags.exif?.ExposureMode?.description || null
      },
      location: this.parseGps(tags),
      dedupedRawTags: cleanRawTags
    };
  }

  parseDate(tags) {
    const rawDate = tags.exif?.DateTimeOriginal?.description || 
                    tags.exif?.DateTimeDigitized?.description || 
                    tags.file?.['File Modified Date']?.description;
    if (!rawDate) return null;

    const match = rawDate.match(/^(\d{4})[:\-](\d{2})[:\-](\d{2})\s+(\d{2}):(\d{2}):?(\d{2})?/);
    if (!match) return rawDate;

    const year = match[1];
    const monthIndex = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    let hour = parseInt(match[4], 10);
    const minute = match[5];

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getOrdinal = (n) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const period = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${period} | ${getOrdinal(day)} ${months[monthIndex]}, ${year}`;
  }

  parseGps(tags) {
    if (tags.gps && typeof tags.gps.Latitude === 'number' && typeof tags.gps.Longitude === 'number') {
      const lat = tags.gps.Latitude;
      const lng = tags.gps.Longitude;

      // Ignore 0.0, 0.0 placeholders
      if (Math.abs(lat) < 0.00001 && Math.abs(lng) < 0.00001) {
        return null;
      }

      let altStr = 'No altitude data recorded';
      const rawVal = tags.gps.Altitude !== undefined && tags.gps.Altitude !== null
        ? Number(tags.gps.Altitude)
        : null;

      if (rawVal !== null && !isNaN(rawVal) && Math.round(rawVal) !== 0) {
        const rawAltMeters = Math.round(rawVal);
        const rawAltFeet = Math.round(rawAltMeters * 3.28084);
        altStr = `${rawAltMeters} m (${rawAltFeet} ft)`;
      }

      return {
        lat: lat,
        lng: lng,
        altitude: altStr
      };
    }
    return null;
  }

  deduplicateTags(tags) {
    const seenNames = new Set();
    const cleanList = [];

    const aliases = {
      'DateTimeDigitized': 'DateTimeOriginal',
      'DateTime': 'DateTimeOriginal',
      'ApertureValue': 'FNumber',
      'ShutterSpeedValue': 'ExposureTime',
      'PixelXDimension': 'Image Width',
      'PixelYDimension': 'Image Height'
    };

    for (const group in tags) {
      if (typeof tags[group] !== 'object') continue;
      for (const tag in tags[group]) {
        const canonical = aliases[tag] || tag;
        if (seenNames.has(canonical.toLowerCase())) continue;

        seenNames.add(canonical.toLowerCase());
        const item = tags[group][tag];
        cleanList.push({
          tag: canonical,
          value: item.description || item.value
        });
      }
    }

    return cleanList;
  }

  async scrubAll(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            resolve(blob);
          }, mime, 0.95);
        } catch (err) {
          URL.revokeObjectURL(url);
          reject(err);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image into memory for scrubbing.'));
      };

      img.src = url;
    });
  }
}