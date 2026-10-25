import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { watch } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const requestedApiPort = Number(process.env.AI_API_PORT || 3001);
let apiPort = requestedApiPort;
let api;
let vite;
let stopping = false;
let restartingApi = false;
let envWatcher;
let serverWatcher;
let envReloadTimer;

function queueApiReload() {
  clearTimeout(envReloadTimer);
  envReloadTimer = setTimeout(() => void restartApi(), 250);
}

async function readRuntimeEnv() {
  const envFile = await readFile(resolve(root, '.env'), 'utf8').catch(() => '');
  const fileEnv = {};
  for (const line of envFile.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || match[1].startsWith('#')) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fileEnv[match[1]] = value;
  }
  return { ...process.env, ...fileEnv, AI_API_PORT: String(apiPort) };
}

function isPortAvailable(port) {
  return new Promise((resolvePort) => {
    const probe = createServer();
    probe.once('error', () => resolvePort(false));
    probe.listen(port, '127.0.0.1', () => probe.close(() => resolvePort(true)));
  });
}

async function findApiPort() {
  for (let offset = 0; offset < 20; offset += 1) {
    const candidate = requestedApiPort + offset;
    if (await isPortAvailable(candidate)) return candidate;
  }
  throw new Error(`No free AI API port found from ${requestedApiPort} to ${requestedApiPort + 19}.`);
}

function waitForApi(child) {
  return new Promise((resolveReady) => {
    let output = '';
    const timeout = setTimeout(() => resolveReady(false), 8_000);
    const finish = (ready) => {
      clearTimeout(timeout);
      resolveReady(ready);
    };
    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      process.stdout.write(text);
      output = (output + text).slice(-500);
      if (output.includes('VillonWood AI API listening at')) finish(true);
    });
    child.stderr.on('data', (chunk) => process.stderr.write(chunk));
    child.once('exit', () => finish(false));
  });
}

async function startApi() {
  const childEnv = await readRuntimeEnv();
  api = spawn(process.execPath, ['server/ai-server.mjs'], { cwd: root, stdio: ['inherit', 'pipe', 'pipe'], env: childEnv });
  const child = api;
  child.on('error', (error) => {
    console.error('Could not start the VillonWood AI API:', error.message);
    stop(1);
  });
  child.on('exit', (code) => {
    if (!stopping && !restartingApi && code !== null && code !== 0) {
      console.error(`VillonWood AI API exited with code ${code}.`);
      stop(code);
    }
  });
  if (!(await waitForApi(child))) {
    if (!stopping) {
      console.error(`The AI API did not become ready on port ${apiPort}.`);
      stop(1);
    }
    return false;
  }
  return true;
}

async function restartApi() {
  if (stopping || restartingApi) return;
  restartingApi = true;
  const previousApi = api;
  console.log('Reloading AI API configuration from .env...');
  if (previousApi && previousApi.exitCode === null) {
    previousApi.kill();
    await once(previousApi, 'exit');
  }
  restartingApi = false;
  if (!stopping) await startApi();
}

function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  clearTimeout(envReloadTimer);
  envWatcher?.close();
  serverWatcher?.close();
  api?.kill();
  vite?.kill();
  process.exitCode = code;
}

async function start() {
  apiPort = await findApiPort();
  if (apiPort !== requestedApiPort) {
    console.log(`Port ${requestedApiPort} is in use; using AI API port ${apiPort}.`);
  }

  if (!(await startApi())) return;

  vite = spawn(npmCommand, ['exec', 'vite', '--', '--host', '0.0.0.0'], { cwd: root, stdio: 'inherit', env: { ...process.env, AI_API_PORT: String(apiPort) }, shell: process.platform === 'win32' });
  vite.on('error', (error) => {
    console.error('Could not start Vite:', error.message);
    stop(1);
  });
  vite.on('exit', (code) => {
    if (!stopping && code !== null) stop(code);
  });

  envWatcher = watch(root, (_event, filename) => {
    if (filename?.toString() !== '.env') return;
    queueApiReload();
  });
  serverWatcher = watch(resolve(root, 'server'), (_event, filename) => {
    if (filename?.toString() !== 'ai-server.mjs') return;
    queueApiReload();
  });
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
start().catch((error) => {
  console.error('Could not start the development app:', error);
  stop(1);
});
