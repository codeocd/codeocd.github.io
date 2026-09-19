import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { findPrivacyViolation, forbiddenPathPattern } from './privacy-policy.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.xml']);

const collectFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) files.push(...await collectFiles(child));
    else files.push(child);
  }
  return files;
};

test('built output excludes private data and legacy routes', async () => {
  assert.ok((await stat(dist)).isDirectory(), 'dist must exist before the privacy scan');
  const files = await collectFiles(dist);
  assert.ok(files.length > 0, 'dist must contain the production build');

  for (const file of files) {
    const relativePath = decodeURIComponent(file.pathname.split('/dist/')[1] ?? '');
    assert.doesNotMatch(relativePath, forbiddenPathPattern, `forbidden deployment path: ${relativePath}`);
    const extension = relativePath.slice(relativePath.lastIndexOf('.')).toLowerCase();
    if (textExtensions.has(extension)) {
      assert.equal(findPrivacyViolation(await readFile(file, 'utf8')), null, `forbidden content in ${relativePath}`);
    }
  }
});
