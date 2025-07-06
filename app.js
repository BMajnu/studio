const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// This intelligent launcher script is a workaround for broken cPanel NPM tooling.
// It checks if dependencies are installed and installs them if needed, before starting the app.

const NODE_MODULES = path.join(__dirname, 'node_modules');

function runCommand(command, args = []) {
  console.log(`[Launcher] Running command: ${command} ${args.join(' ')}`);
  try {
    // Using execSync for simplicity in this sequential script.
    // This will block until the command is complete.
    execSync(`${command} ${args.join(' ')}`, { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.error(`[Launcher] Command failed: ${command} ${args.join(' ')}`);
    // The error object from execSync often has useful details in stdout/stderr.
    console.error(e.stdout ? e.stdout.toString() : '');
    console.error(e.stderr ? e.stderr.toString() : '');
    return false;
  }
}

function startApp() {
  console.log('[Launcher] Starting Next.js application...');
  // Use spawn for the long-running Next.js process.
  const app = spawn('npm', ['start'], { stdio: 'inherit', shell: true });

  app.on('close', (code) => {
    console.log(`[Launcher] Application process exited with code ${code}`);
    // If the app crashes, exit the launcher script.
    process.exit(code);
  });

  app.on('error', (err) => {
    console.error('[Launcher] Failed to start Next.js application.', err);
    process.exit(1);
  });
}

// --- Main Execution ---

console.log('[Launcher] Initializing...');

// Check if node_modules exists.
if (!fs.existsSync(NODE_MODULES)) {
  console.log('[Launcher] node_modules not found. Running clean installation...');

  // Run a clean production install.
  // Using --omit=dev is the modern equivalent of --production.
  const installSuccess = runCommand('npm', ['install', '--omit=dev', '--no-audit']);

  if (installSuccess) {
    console.log('[Launcher] Installation successful.');
    startApp();
  } else {
    console.error('[Launcher] Installation failed. See logs above. Exiting.');
    process.exit(1);
  }
} else {
  console.log('[Launcher] node_modules found. Starting application directly.');
  startApp();
} 