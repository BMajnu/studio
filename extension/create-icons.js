/**
 * Generate PNG icons from base64 data for the extension
 */

const fs = require('fs');
const path = require('path');

// Base64 encoded 128x128 icon (simplified purple gradient with D)
const icon128Base64 = `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`;

// Create smaller icons by scaling (simplified approach)
const iconSizes = {
  16: icon128Base64,  // In production, you'd properly scale these
  32: icon128Base64,
  48: icon128Base64,
  128: icon128Base64
};

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Write icon files
Object.entries(iconSizes).forEach(([size, base64]) => {
  const buffer = Buffer.from(base64, 'base64');
  const filename = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filename, buffer);
  console.log(`Created ${filename}`);
});

console.log('Icons created successfully!');
