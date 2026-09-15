import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('renders Haibiao Zhang academic profile by default', async ({ page, isMobile }) => {
  await expect(page).toHaveTitle('Haibiao Zhang · Academic Homepage');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.profile-identity').getByRole('heading')).toContainText('Haibiao Zhang');
  await expect(page.locator('.profile-avatar-placeholder')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download CV' })).toHaveAttribute('href', '/cv/haibiao-zhang-en.pdf');
  await expect(page.locator('a[href="mailto:haibiaozhang@mail.ustc.edu.cn"]')).toBeVisible();
  await expect(page.locator('a[href="mailto:15388581962"]')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('Xi\'an Jiaotong-Liverpool');
  await expect(page.locator('body')).not.toContainText('Haichao Zhang');
  await expect(page.locator('#opensource')).toHaveCount(0);
  await expect(page.locator('#publications .publication-paper')).toHaveCount(1);
  await expect(page.locator('#collaborative-publications .publication-paper')).toHaveCount(3);
  await expect(page.locator('#ongoing-research .ongoing-item')).toHaveCount(1);
  await expect(page.locator('#ongoing-research')).toContainText('AAAI 2027');
  await expect(page.locator('#intellectual-property .ip-item')).toHaveCount(4);
  await expect(page.locator('#skills .skill-item')).toHaveCount(4);
  await expect(page.locator('#publications')).toContainText('Data-driven fault diagnosis method for abnormal RF oscillation of gyrotrons');
  await expect(page.locator('#publications a[href="https://doi.org/10.1063/5.0195400"]').first()).toBeVisible();

  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);

  const images = await page.locator('img[src]:not([src=""])').evaluateAll((elements) => elements.map((image) => {
    if (!(image instanceof HTMLImageElement)) return { complete: false, naturalWidth: 0 };
    return { complete: image.complete, naturalWidth: image.naturalWidth };
  }));
  expect(images.every((image) => image.complete && image.naturalWidth > 0)).toBe(true);

  const composition = await page.evaluate(() => {
    const sidebar = document.querySelector('.academic-sidebar')?.getBoundingClientRect();
    const main = document.querySelector('.academic-main')?.getBoundingClientRect();
    return { sidebarRight: sidebar?.right ?? 0, mainLeft: main?.left ?? 0 };
  });
  if (!isMobile) expect(composition.sidebarRight).toBeLessThanOrEqual(composition.mainLeft + 1);
});

test('switches language and persists the preference', async ({ page }) => {
  await page.getByRole('button', { name: '中文' }).click();
  await expect(page).toHaveTitle('张海彪 · 学术主页');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.locator('.profile-identity').getByRole('heading')).toContainText('张海彪');
  await expect(page.getByRole('link', { name: '下载简历' })).toHaveAttribute('href', '/cv/haibiao-zhang-zh.pdf');
  await expect(page.locator('#about')).toContainText('回旋管');
  await expect(page.locator('#intellectual-property')).toContainText('已授权发明专利');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.locator('.profile-identity').getByRole('heading')).toContainText('张海彪');
});

test('mobile navigation exposes the available sections without overflow', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only interaction');
  const menu = page.locator('.menu-toggle');
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Publications' })).toBeVisible();
  await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Skills' })).toBeVisible();
  await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Open Source' })).toHaveCount(0);

  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
});

test('reduced-motion users receive visible content without entrance delays', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('.reveal').first()).toHaveCSS('opacity', '1');
});

test('publication and timeline sections appear in the intended order', async ({ page }) => {
  const positions = await page.evaluate(() => {
    const ids = ['news', 'experience-education', 'publications', 'ongoing-research', 'intellectual-property', 'skills', 'awards'];
    return ids.map((id) => document.getElementById(id)?.offsetTop ?? -1);
  });
  for (let index = 1; index < positions.length; index += 1) {
    expect(positions[index]).toBeGreaterThan(positions[index - 1]);
  }
});
