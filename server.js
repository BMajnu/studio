// server.js
// This intelligent custom server installs its own dependencies to bypass broken cPanel tooling.

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const next = require('next');
const http = require('http');
const url = require('url');

// --- Pre-flight Checks and Auto-Installation ---

const NODE_MODULES = path.join(__dirname, 'node_modules');

// Check if node_modules exists. If not, run a clean production install.
if (!fs.existsSync(NODE_MODULES)) {
  console.log('[Server] node_modules not found. Running clean production installation...');
  try {
    // Using --omit=dev is the modern equivalent of --production
    execSync('npm install --omit=dev --no-audit', { stdio: 'inherit' });
    console.log('[Server] Installation complete.');
  } catch (e) {
    console.error('[Server] NPM installation failed. Please check the logs.');
    // Exit the process if installation fails, so cPanel shows an error.
    process.exit(1);
  }
}

// --- Next.js Server Setup ---

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

// Create a Next.js app instance.
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}); 