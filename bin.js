#!/usr/bin/env node

/**
 * NHFS — Next HTTP File Server
 * Production server launcher
 */

const { execSync } = require('child_process');
const path = require('path');

(async () => {
  try {
    const nextBinary = path.join(
      'out',
      'standalone',
      'server.js',
    );
    const port = process.env.NHFS_PORT || 3000;

    // Check if build exists
    try {
      execSync(`PORT=${port} node ${nextBinary}`, { stdio: 'inherit' });
    } catch {
      // console.log('📦 No production build found, building first...');
      // execSync(`npm run build`, { stdio: 'inherit' });
      // execSync(`PORT=${port} node ${nextBinary}`, { stdio: 'inherit' });
    }
  } catch (err) {
    console.error('❌ Failed to start NHFS:', err);
    process.exit(1);
  }
})();
