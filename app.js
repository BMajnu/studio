const { execSync } = require('child_process');
const express = require('express');
const path = require('path');
const fs = require('fs');

// Paths
const ROOT_DIR = __dirname;
const NODE_MODULES = path.join(ROOT_DIR, 'node_modules');
const NEXT_BUILD = path.join(ROOT_DIR, '.next');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Function to run commands
function runCommand(command, args = []) {
  console.log(`[Launcher] Running command: ${command} ${args.join(' ')}`);
  try {
    execSync(`${command} ${args.join(' ')}`, { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.error(`[Launcher] Command failed: ${command} ${args.join(' ')}`);
    return false;
  }
}

// Check if we need to install dependencies and build
if (!fs.existsSync(NODE_MODULES)) {
  console.log('[Launcher] Installing dependencies...');
  const installSuccess = runCommand('npm', ['install', '--omit=dev']);
  if (!installSuccess) {
    console.error('[Launcher] Failed to install dependencies. Exiting.');
    process.exit(1);
  }
}

// Try to install express if it's not already installed
if (!fs.existsSync(path.join(NODE_MODULES, 'express'))) {
  console.log('[Launcher] Installing Express...');
  runCommand('npm', ['install', 'express', '--no-save']);
}

// Check if we need to build the Next.js app
if (!fs.existsSync(NEXT_BUILD)) {
  console.log('[Launcher] Building Next.js application...');
  
  // First try using npx
  let buildSuccess = runCommand('npx', ['next', 'build']);
  
  // If that fails, try using the local next binary directly
  if (!buildSuccess) {
    const nextBin = path.join(NODE_MODULES, '.bin', 'next');
    if (fs.existsSync(nextBin)) {
      buildSuccess = runCommand(nextBin, ['build']);
    }
  }
  
  if (!buildSuccess) {
    console.error('[Launcher] Failed to build Next.js application. Exiting.');
    process.exit(1);
  }
}

// Serve static files from the .next directory
if (fs.existsSync(path.join(NEXT_BUILD, 'static'))) {
  app.use('/_next', express.static(path.join(NEXT_BUILD, 'static')));
}

// Serve files from the public directory if it exists
if (fs.existsSync(PUBLIC_DIR)) {
  app.use(express.static(PUBLIC_DIR));
}

// Create a simple HTML page that will redirect to the correct URL
const indexHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>DesAInR Studio</title>
  <meta http-equiv="refresh" content="0;url=http://voicey.desainr.shop">
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .loader {
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin-right: 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .container {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .loading-text {
      margin-top: 20px;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="loader"></div>
    <p class="loading-text">Loading DesAInR Studio...</p>
  </div>
</body>
</html>
`;

// Serve the index.html for all routes
app.get('*', (req, res) => {
  res.send(indexHtml);
});

// Start the server
app.listen(PORT, () => {
  console.log(`[Launcher] Server running on port ${PORT}`);
}); 