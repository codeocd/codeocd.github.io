import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const root = new URL('../', import.meta.url);
const execFileAsync = promisify(execFile);
const read = (path) => readFile(new URL(path, root), 'utf8');

const requiredAssets = [
  'public/cv/haibiao-zhang-en.pdf',
  'public/cv/haibiao-zhang-zh.pdf'
];

const publishedTitles = [
  'Data-driven fault diagnosis method for abnormal RF oscillation of gyrotrons',
  'Robust learning-based fault prediction method for gyrotron system',
  'Simulation analysis of the motion accuracy of the ECRH launcher steering mechanism based on ADAMS',
  'Investigation of electron cyclotron wave absorption and current drive in CFEDR conventional H-mode scenario'
];

test('current CV assets exist and are non-empty', async () => {
  for (const asset of requiredAssets) {
    const details = await stat(new URL(asset, root));
    assert.ok(details.isFile(), `${asset} must be a file`);
    assert.ok(details.size > 0, `${asset} must not be empty`);
  }
});

test('current CV assets are tracked for deployment', async () => {
  await execFileAsync('git', ['ls-files', '--error-unmatch', '--', ...requiredAssets], {
    cwd: fileURLToPath(root)
  });
});

test('publication cache contains only the resume-backed published papers', async () => {
  const data = JSON.parse(await read('src/data/publications.json'));
  assert.equal(data.source, 'manual');
  assert.equal(data.scholarId, '');
  assert.deepEqual(data.publications.map((item) => item.title), publishedTitles);
  for (const publication of data.publications) {
    assert.ok(publication.authors.includes('Haibiao Zhang'));
    assert.ok(Number.isInteger(publication.year));
    assert.match(publication.url, /^https:\/\//);
    assert.equal(publication.citations, null);
  }
});

test('site data matches the current academic identity and resume outputs', async () => {
  const site = await read('src/data/site.ts');
  assert.match(site, /en: 'Haibiao Zhang'/);
  assert.match(site, /zh: '张海彪'/);
  assert.match(site, /University of Science and Technology of China/);
  assert.match(site, /gyrotron/);
  assert.match(site, /Trajectory-Witness Conformal Surrogate/);
  for (const identifier of ['CN 120029768 B', 'CN 121619724 B', '2025SR1824848', '2020SR0059618']) {
    assert.match(site, new RegExp(identifier.replaceAll(' ', '\\s*')));
  }
  assert.doesNotMatch(site, /Haichao Zhang|Xi'an Jiaotong-Liverpool|zRvnGK0AAAAJ|Jia Wang/);
});

test('page uses data-driven identity and safe optional links', async () => {
  const page = await read('src/pages/index.astro');
  assert.match(page, /profile\.name\.en/);
  assert.match(page, /profile\.location\.en/);
  assert.match(page, /profile\.portrait \?/);
  assert.match(page, /profile\.links\.github &&/);
  assert.match(page, /profile\.links\.scholar &&/);
  assert.match(page, /markAuthor/);
  assert.doesNotMatch(page, /Haichao Zhang/);
  assert.doesNotMatch(page, /Xi'an Jiaotong-Liverpool/);
  assert.doesNotMatch(page, /zhc@liverpool\.ac\.uk/);
});

test('page renders publications, collaborative work, ongoing work, and intellectual property from data', async () => {
  const page = await read('src/pages/index.astro');
  const site = await read('src/data/site.ts');
  assert.match(page, /publicationPresentation/);
  assert.match(page, /collaborativeCuratedPublications/);
  assert.match(page, /ongoingResearch\.map/);
  assert.match(page, /intellectualProperty\.map/);
  assert.match(site, /AAAI 2027/);
  assert.match(site, /Data-driven Optimization of Electron Gun Parameters/);
  assert.match(site, /Fault Prediction of Gyrotron Operating Parameters/);
});

test('optional figures and empty open-source data do not create broken markup', async () => {
  const page = await read('src/pages/index.astro');
  assert.match(page, /figure &&/);
  assert.match(page, /paper\.image &&/);
  assert.match(page, /availableOpenSource\.length/);
  assert.match(page, /intellectualProperty[\s\S]*image/);
});

test('scholar automation is disabled until a verified profile id is supplied', async () => {
  const workflow = await read('.github/workflows/scholar-sync.yml');
  const updater = await read('scripts/update_scholar.py');
  assert.doesNotMatch(workflow, /zRvnGK0AAAAJ/);
  assert.match(workflow, /SCHOLAR_ID/);
  assert.match(workflow, /skip.*Scholar|Scholar.*skip/i);
  assert.match(updater, /DEFAULT_SCHOLAR_ID\s*=\s*["']{2}/);
});

test('documentation names the current person and records pending confirmations', async () => {
  const readme = await read('README.md');
  assert.match(readme, /Haibiao Zhang/);
  assert.match(readme, /gyrotron|fusion/i);
  assert.match(readme, /Scholar/i);
  assert.doesNotMatch(readme, /Xi'an Jiaotong-Liverpool/);
});

test('public source does not expose private contact data or old template identity', async () => {
  const files = ['src/data/site.ts', 'src/pages/index.astro', 'src/styles/global.css', 'README.md'];
  const source = (await Promise.all(files.map(read))).join('\n');
  assert.doesNotMatch(source, /15388581962/);
  assert.doesNotMatch(source, /No\.96 Jinzhai Road/i);
  assert.doesNotMatch(source, /zhc@liverpool\.ac\.uk/i);
  assert.doesNotMatch(source, /Haichao Zhang|XJTLU|Xi'an Jiaotong-Liverpool/);
  assert.match(source, /haibiaozhang@mail\.ustc\.edu\.cn/i);
});

test('framework and legacy data are no longer used by the page', async () => {
  const page = await read('src/pages/index.astro');
  const frameworks = JSON.parse(await read('src/data/frameworks.json'));
  assert.doesNotMatch(page, /frameworkData/);
  assert.deepEqual(frameworks.frameworks, []);
  assert.doesNotMatch(page, /legacy/);
});

test('public deployment does not include unconfirmed template identity or legacy assets', async () => {
  const publicFiles = await execFileAsync('git', ['ls-files', '--others', '--exclude-standard', '--', 'public'], {
    cwd: fileURLToPath(root)
  });
  const tracked = await execFileAsync('git', ['ls-files', '--', 'public'], {
    cwd: fileURLToPath(root)
  });
  const paths = `${publicFiles.stdout}\n${tracked.stdout}`;
  assert.doesNotMatch(paths, /haichao-zhang|portrait-haichao|public[\\/]legacy|images[\\/]papers|intellectual-property/i);

  const config = await read('astro.config.mjs');
  const page = await read('src/pages/index.astro');
  const readme = await read('README.md');
  assert.doesNotMatch(`${config}\n${page}\n${readme}`, /codeocd\.github\.io|zhang-haichao\.github\.io|Haichao-Zhang-academic-homepage/i);
});
