const { exec } = require('child_process');

// This script starts the Next.js application using the 'npm start' command.
// It is used as a workaround for cPanel's Node.js hosting environment,
// which requires a specific startup file.

console.log('Starting Next.js application...');

const child = exec('npm start', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting application: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

child.on('exit', (code) => {
  console.log(`Application process exited with code ${code}`);
}); 