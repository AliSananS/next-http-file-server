#!/usr/bin/env node

/**
 * NHFS — Next HTTP File Server
 * Production server launcher with CLI args
 */

const { execSync } = require('child_process');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  const aliases = {
    p: 'port',
    port: 'port',
    d: 'dir',
    dir: 'dir',
    h: 'hostname',
    hostname: 'hostname'
  };

  for (let i = 0; i < argv.length; i++) {
    let arg = argv[i];

    if (arg.startsWith('--')) {
      arg = arg.slice(2);
    } else if (arg.startsWith('-')) {
      arg = arg.slice(1);
    } else {
      continue;
    }

    const key = aliases[arg];
    if (!key) {
      console.warn(`⚠️  Unknown option: "${argv[i]}"`);
      continue;
    }

    const value = argv[i + 1];
    if (!value || value.startsWith('-')) {
      console.error(`❌ Missing value for "${argv[i]}"`);
      process.exit(1);
    }

    args[key] = value;
    i++;
  }

  return args;
}

(async () => {
  try {
    const argv = process.argv.slice(2);
    const args = parseArgs(argv);

    if (args.port) process.env.NHFS_PORT = args.port;
    if (args.dir) process.env.NHFS_BASE_DIR = path.resolve(args.dir);
    if (args.hostname) process.env.HOSTNAME = args.hostname;

    const nextBinary = path.join('build', 'server.js');
    const port = process.env.NHFS_PORT || 3000;
    const host = process.env.HOSTNAME || 'localhost';

      console.log(`📂 Serving files from: ${process.env.NHFS_BASE_DIR || process.cwd()}`);

    try {
      console.log(`Running Server at http://${host}:${port}`);
      execSync(`PORT=${port} HOSTNAME=${host} node ${nextBinary}`, { stdio: 'ignore' });
    } catch (err) {
      console.error('❌ Error running server:', err.message);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Failed to start NHFS:', err.message);
    process.exit(1);
  }
})();
