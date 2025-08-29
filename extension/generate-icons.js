/**
 * Script to generate extension icons
 * Creates a simple but professional icon for the DesAInR extension
 */

const fs = require('fs');
const path = require('path');

// Create SVG icon
const svgIcon = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background circle -->
  <circle cx="64" cy="64" r="60" fill="url(#gradient)" filter="url(#shadow)"/>
  
  <!-- Letter D -->
  <text x="64" y="80" font-family="'Segoe UI', system-ui, -apple-system, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">D</text>
  
  <!-- AI sparkles -->
  <g fill="white" opacity="0.9">
    <circle cx="90" cy="38" r="2"/>
    <circle cx="94" cy="42" r="1.5"/>
    <circle cx="86" cy="42" r="1.5"/>
    <circle cx="90" cy="46" r="2"/>
  </g>
</svg>`;

// Create HTML file for icon generation
const htmlTemplate = (size) => `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; }
    .icon {
      width: ${size}px;
      height: ${size}px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      font-size: ${size * 0.5}px;
      font-weight: bold;
      color: white;
      position: relative;
    }
    .sparkle {
      position: absolute;
      width: ${size * 0.06}px;
      height: ${size * 0.06}px;
      background: white;
      border-radius: 50%;
      opacity: 0.9;
    }
    .sparkle1 { top: 20%; right: 25%; }
    .sparkle2 { top: 25%; right: 20%; width: ${size * 0.04}px; height: ${size * 0.04}px; }
    .sparkle3 { top: 25%; right: 30%; width: ${size * 0.04}px; height: ${size * 0.04}px; }
  </style>
</head>
<body>
  <div class="icon">
    D
    <div class="sparkle sparkle1"></div>
    <div class="sparkle sparkle2"></div>
    <div class="sparkle sparkle3"></div>
  </div>
</body>
</html>`;

// Create icon sizes
const sizes = [16, 32, 48, 128];

// Save SVG
fs.writeFileSync(path.join(__dirname, 'public', 'icon.svg'), svgIcon);

// Create PNG placeholders (in a real scenario, you'd use a library like sharp or canvas)
sizes.forEach(size => {
  const html = htmlTemplate(size);
  fs.writeFileSync(path.join(__dirname, 'public', `icon${size}.html`), html);
  console.log(`Created icon${size}.html - Open in browser and screenshot to create icon${size}.png`);
});

console.log('Icon templates generated. For production, use a proper image generation library.');
console.log('For now, you can open the HTML files in a browser and take screenshots.');
