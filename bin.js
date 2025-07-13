#!/usr/bin/env node

import arg from 'arg';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CLI args
const args = arg({
  '--port': Number,
  '--dir': String,
  '--silent': Boolean,
  '-p': '--port',
  '-d': '--dir',
});

const port = args['--port'] || 3000;
const dir = args['--dir'] || process.cwd();
const silent = args['--silent'] || false;

if (!silent) {
  console.log(`🚀 Starting NHFS on http://localhost:${port}`);
  console.log(`📂 Serving: ${dir}`);
}

// Pass env vars into Next.js
const next = spawn('npx', ['next', 'start', '-p', port], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    NHFS_ROOT: dir,
    NHFS_SILENT: silent ? '1' : '0',
  },
});
