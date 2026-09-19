import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { findPrivacyViolation } from './privacy-policy.mjs';

const root = new URL('../', import.meta.url);
const execFileAsync = promisify(execFile);
const read = (path) => readFile(new URL(path, root), 'utf8');
const privacySourceRoots = ['src/', 'public/', '.github/', 'astro.config.mjs', 'package.json', 'README.md'];
const privacyTextExtensions = new Set(['.astro', '.css', '.html', '.js', '.json', '.md', '.mjs', '.ts', '.txt', '.xml', '.yml', '.yaml']);

const collectPrivacySourceFiles = async (relativePath) => {
  const url = new URL(relativePath, root);
  const details = await stat(url);
  if (details.isFile()) return [url];

  const files = [];
  for (const entry of await readdir(url, { withFileTypes: true })) {
    const childPath = `${relativePath}${entry.name}${entry.isDirectory() ? '/' : ''}`;
    if (entry.isDirectory()) files.push(...await collectPrivacySourceFiles(childPath));
    else if (privacyTextExtensions.has(entry.name.slice(entry.name.lastIndexOf('.')).toLowerCase())) files.push(new URL(childPath, root));
  }
  return files;
};

const requiredAssets = [
  'public/images/profile/haibiao-zhang.jpg',
  'public/images/contact/wechat-haibiao-zhang.png',
  'public/images/publications/rf-oscillation-diagnosis.jpg',
  'public/images/publications/robust-fault-prediction.png',
  'public/images/publications/ecrh-launcher.png',
  'public/images/publications/cfedr-eccd.png',
  'public/images/publications/twcs.png',
  'public/images/ip/cn120029768b.png',
  'public/images/ip/cn121619724b.png',
  'public/images/ip/2025sr1824848.png',
  'public/images/ip/2020sr0059618.png',
  'public/images/institutions/ustc.png',
  'public/images/institutions/swfu.png',
  'public/images/institutions/ipp-cas.png'
];

const forbiddenPublicAssets = [
  'public/cv/haibiao-zhang-en.pdf',
  'public/cv/haibiao-zhang-zh.pdf'
];

const publishedTitles = [
  'Data-driven fault diagnosis method for abnormal RF oscillation of gyrotrons',
  'Robust learning-based fault prediction method for gyrotron system',
  'Simulation analysis of the motion accuracy of the ECRH launcher steering mechanism based on ADAMS',
  'Investigation of electron cyclotron wave absorption and current drive in CFEDR conventional H-mode scenario'
];

test('approved public assets exist and are non-empty', async () => {
  for (const asset of requiredAssets) {
    const details = await stat(new URL(asset, root));
    assert.ok(details.isFile(), `${asset} must be a file`);
    assert.ok(details.size > 0, `${asset} must not be empty`);
  }
});

test('approved public assets are tracked for deployment', async () => {
  await execFileAsync('git', ['ls-files', '--error-unmatch', '--', ...requiredAssets], {
    cwd: fileURLToPath(root)
  });
});

test('downloadable CV assets are absent from deployment', async () => {
  for (const asset of forbiddenPublicAssets) {
    await assert.rejects(access(new URL(asset, root)));
  }
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
  assert.match(site, /https:\/\/github\.com\/codeocd/);
  assert.match(site, /_liHsuEAAAAJ/);
  assert.match(site, /t20200907_365792\.html/);
  assert.match(site, /Researcher Xiaojie Wang/);
  assert.match(site, /zhang-haichao\/senpai-skill/);
  assert.match(site, /Core Contributor/);
  assert.match(site, /2026-03-10/);
  assert.match(site, /2026-03-31/);
  assert.match(site, /2025-09-19/);
  assert.match(site, /2020-01-13/);
  for (const identifier of ['CN 120029768 B', 'CN 121619724 B', '2025SR1824848', '2020SR0059618']) {
    assert.match(site, new RegExp(identifier.replaceAll(' ', '\\s*')));
  }
  assert.doesNotMatch(site, /Haichao Zhang|Xi'an Jiaotong-Liverpool|zRvnGK0AAAAJ|Jia Wang|Prof\. Xiaojie Wang|22,000|50%|CRAFT/);
});

test('page uses data-driven identity and safe optional links', async () => {
  const page = await read('src/pages/index.astro');
  assert.match(page, /profile\.name\.en/);
  assert.match(page, /profile\.location\.en/);
  assert.match(page, /profile\.portrait \?/);
  assert.match(page, /profile\.links\.github &&/);
  assert.match(page, /profile\.links\.scholar &&/);
  assert.match(page, /data-modal-open/);
  assert.match(page, /markAuthor/);
  assert.match(page, /rel="canonical"/);
  assert.match(page, /data-alt-en/);
  assert.match(page, /data-alt-zh/);
  assert.doesNotMatch(page, /Download CV|下载简历|data-cv-link/);
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
  assert.match(site, /AAAI 2027 · 在审/);
  assert.match(site, /Data-driven Optimization of Electron Gun Parameters/);
  assert.match(site, /Fault Prediction of Gyrotron Operating Parameters/);
});

test('confirmed figures and open-source project render without placeholders', async () => {
  const page = await read('src/pages/index.astro');
  assert.match(page, /figure &&/);
  assert.match(page, /paper\.image &&/);
  assert.match(page, /availableOpenSource\.length/);
  assert.match(page, /intellectualProperty[\s\S]*image/);
  assert.doesNotMatch(page, /profile-avatar-placeholder|institution-logo-placeholder|paper-link-placeholder/);
});

test('scholar automation is not deployed', async () => {
  await assert.rejects(access(new URL('.github/workflows/scholar-sync.yml', root)));
});

test('documentation names the current person and confirmed public services', async () => {
  const readme = await read('README.md');
  assert.match(readme, /Haibiao Zhang/);
  assert.match(readme, /gyrotron|fusion/i);
  assert.match(readme, /Scholar/i);
  assert.doesNotMatch(readme, /Xi'an Jiaotong-Liverpool/);
});

test('public source does not expose private contact data or old template identity', async () => {
  const files = (await Promise.all(privacySourceRoots.map(collectPrivacySourceFiles))).flat();
  const source = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');
  assert.doesNotMatch(source, /15388581962/);
  assert.doesNotMatch(source, /No\.96 Jinzhai Road/i);
  assert.doesNotMatch(source, /金寨路\s*96\s*号/i);
  assert.doesNotMatch(source, /22,000|approximately\s+50%|降低约\s*50%|CRAFT/i);
  assert.doesNotMatch(source, /zhc@liverpool\.ac\.uk/i);
  assert.doesNotMatch(source, /Haichao Zhang|XJTLU|Xi'an Jiaotong-Liverpool/);
  assert.match(source, /haibiaozhang@mail\.ustc\.edu\.cn/i);
  assert.equal(findPrivacyViolation(source), null);
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
  assert.doesNotMatch(paths, /haichao-zhang|portrait-haichao|public[\\/]legacy/i);

  const config = await read('astro.config.mjs');
  const page = await read('src/pages/index.astro');
  const readme = await read('README.md');
  assert.match(config, /site:\s*'https:\/\/codeocd\.github\.io'/);
  assert.match(readme, /https:\/\/codeocd\.github\.io/);
  assert.doesNotMatch(`${config}\n${page}\n${readme}`, /zhang-haichao\.github\.io|Haichao-Zhang-academic-homepage/i);
});
