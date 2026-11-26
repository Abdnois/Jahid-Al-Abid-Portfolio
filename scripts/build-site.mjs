import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Stages the untouched static Framer site plus the freshly built FlexCarousel
 * bundle into dist/. Vite never parses index.html or the Framer runtime.
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

const entries = [
  'index.html',
  'css',
  'js',
  'assets',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'README.md'
];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const entry of entries) {
  const from = resolve(root, entry);
  if (!existsSync(from)) continue;
  cpSync(from, resolve(dist, entry), { recursive: true });
}

const bundle = resolve(dist, 'js/flexcarousel/flexcarousel.js');
if (!existsSync(bundle)) {
  throw new Error('FlexCarousel bundle missing from dist; run "vite build" first.');
}

console.log('[build] static site staged in dist/');
