const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// This intelligent launcher script is a workaround for broken cPanel NPM tooling.
// It checks if dependencies AND the build exist, and regenerates them if needed
// before starting the application.

const NODE_MODULES = path.join(__dirname, 'node_modules');
const NEXT_BUILD = path.join(__dirname, '.next');

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

function startApp() {
  console.log('[Launcher] Starting Next.js application...');
  // Use npx to ensure we're using the local installation of next
  const app = spawn('npx', ['next', 'start'], { stdio: 'inherit', shell: true });
  app.on('close', (code) => {
    console.log(`[Launcher] Application process exited with code ${code}`);
    process.exit(code);
  });
  app.on('error', (err) => {
    console.error('[Launcher] Failed to start Next.js application.', err);
    process.exit(1);
  });
}

// --- Main Execution ---
console.log('[Launcher] Initializing...');

// Check if node_modules or the production build folder is missing.
if (!fs.existsSync(NODE_MODULES) || !fs.existsSync(NEXT_BUILD)) {
  
  if (!fs.existsSync(NODE_MODULES)) {
    console.log('[Launcher] node_modules not found. Running clean installation...');
    const installSuccess = runCommand('npm', ['install', '--omit=dev', '--no-audit']);
    if (!installSuccess) {
      console.error('[Launcher] Installation failed. Exiting.');
      process.exit(1);
    }
  }

  console.log('[Launcher] Running production build...');
  // Use npx to ensure we're using the local installation of next
  const buildSuccess = runCommand('npx', ['next', 'build']);
  if (!buildSuccess) {
    console.error('[Launcher] Build failed. Exiting.');
    process.exit(1);
  }

  console.log('[Launcher] Setup complete. Starting application.');
  startApp();

} else {
  console.log('[Launcher] Dependencies and build found. Starting application directly.');
  startApp();
} 