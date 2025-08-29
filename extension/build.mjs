import { build } from 'esbuild';

async function main() {
  try {
    await build({
      entryPoints: {
        background: 'src/background.ts',
        contentScript: 'src/contentScript.ts'
      },
      outdir: 'dist',
      bundle: true,
      minify: true,
      sourcemap: false,
      platform: 'browser',
      target: ['chrome100'],
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      logLevel: 'info',
      format: 'iife'
    });
    console.log('Build completed.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
