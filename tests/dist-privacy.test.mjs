import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.xml']);
const forbiddenContent = /15388581962|No\.96 Jinzhai Road|金寨路\s*96\s*号|22,000|approximately\s+50%|降低约\s*50%|CRAFT|zhc@liverpool\.ac\.uk|Haichao Zhang|XJTLU|Xi'an Jiaotong-Liverpool/i;
const forbiddenPath = /(?:^|\/)(?:cv|legacy)(?:\/|$)|haichao-zhang|portrait-haichao/i;

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
    assert.doesNotMatch(relativePath, forbiddenPath, `forbidden deployment path: ${relativePath}`);
    const extension = relativePath.slice(relativePath.lastIndexOf('.')).toLowerCase();
    if (textExtensions.has(extension)) {
      assert.doesNotMatch(await readFile(file, 'utf8'), forbiddenContent, `forbidden content in ${relativePath}`);
    }
  }
});
