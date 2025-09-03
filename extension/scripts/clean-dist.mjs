#!/usr/bin/env node
import { rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

async function main() {
  const dist = join(process.cwd(), 'dist');
  try {
    if (existsSync(dist)) {
      await rm(dist, { recursive: true, force: true });
      console.log(`[clean-dist] Removed ${dist}`);
    } else {
      console.log(`[clean-dist] No dist folder to remove at ${dist}`);
    }
  } catch (err) {
    console.error('[clean-dist] Failed to clean dist:', err?.message || err);
    process.exitCode = 1;
  }
}

main();
