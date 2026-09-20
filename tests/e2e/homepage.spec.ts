import { expect, test, type Page } from '@playwright/test';

const expectNoHorizontalOverflow = async (page: Page) => {
  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
};

const expectLoadedImages = async (page: Page) => {
  const images = page.locator('img[src]:not([src=""])');
  const count = await images.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => ({
      complete: (element as HTMLImageElement).complete,
      naturalWidth: (element as HTMLImageElement).naturalWidth,
      naturalHeight: (element as HTMLImageElement).naturalHeight
    }))).toMatchObject({ complete: true });
    const dimensions = await image.evaluate((element) => ({
      width: (element as HTMLImageElement).naturalWidth,
      height: (element as HTMLImageElement).naturalHeight
    }));
    expect(dimensions.width).toBeGreaterThan(0);
    expect(dimensions.height).toBeGreaterThan(0);
  }
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('renders the approved English profile and public sections by default', async ({ page, isMobile }) => {
  await expect(page).toHaveTitle('Haibiao Zhang');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://zhanghaibiao.loc.cc/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.profile-identity').getByRole('heading')).toContainText('Haibiao Zhang');
  await expect(page.locator('.profile-avatar')).toHaveAttribute('src', '/images/profile/haibiao-zhang.jpg');
  await expect(page.getByRole('link', { name: /Download CV|下载简历/ })).toHaveCount(0);
  await expect(page.locator('a[href="mailto:haibiaozhang@mail.ustc.edu.cn"]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Google Scholar', exact: true })).toBeVisible();
  await expect(page.locator('a[href="https://github.com/codeocd"]')).toBeVisible();
  await expect(page.locator('a[href*="t20200907_365792.html"]')).toBeVisible();
  const volunteerPhoto = page.locator('#experience-education .timeline-photo');
  await expect(volunteerPhoto).toHaveCount(1);
  await expect(volunteerPhoto.locator('img')).toHaveAttribute('src', '/images/experience/science-popularization-volunteer.png');
  await expect(page.locator('body')).not.toContainText('CRAFT');
  await expect(page.locator('body')).not.toContainText('Haichao Zhang');

  await expect(page.locator('#publications .publication-paper')).toHaveCount(1);
  await expect(page.locator('#collaborative-publications .publication-paper')).toHaveCount(3);
  await expect(page.locator('#ongoing-research .ongoing-item')).toHaveCount(1);
  await expect(page.locator('#ongoing-research')).toContainText('AAAI 2027 · Under Review');
  await expect(page.locator('#intellectual-property .ip-item')).toHaveCount(4);
  await expect(page.locator('#skills .skill-item')).toHaveCount(4);

  const projects = page.locator('#opensource .project-item');
  await expect(projects).toHaveCount(1);
  await expect(projects).toContainText('senpai-skill');
  await expect(projects).toContainText('Core Contributor');
  await expect(projects).toHaveAttribute('href', 'https://github.com/zhang-haichao/senpai-skill');

  await expectNoHorizontalOverflow(page);
  await expectLoadedImages(page);

  if (!isMobile) {
    const composition = await page.evaluate(() => {
      const sidebar = document.querySelector('.academic-sidebar')?.getBoundingClientRect();
      const main = document.querySelector('.academic-main')?.getBoundingClientRect();
      return { sidebarRight: sidebar?.right ?? 0, mainLeft: main?.left ?? 0 };
    });
    expect(composition.sidebarRight).toBeLessThanOrEqual(composition.mainLeft + 1);
  }
});

test('switches every visible language layer while keeping the title fixed and persists the preference', async ({ page }) => {
  await expect(page.locator('.profile-avatar')).toHaveAttribute('alt', 'Portrait of Haibiao Zhang');
  await expect(page.locator('#publications .paper-figure img').first()).toHaveAttribute('alt', 'Data-driven fault diagnosis for abnormal RF oscillation of gyrotrons');
  await expect(page.locator('#intellectual-property .ip-document-preview img').first()).toHaveAttribute('alt', 'CN 120029768 B invention patent record');
  await page.getByRole('button', { name: '中文' }).click();
  await expect(page).toHaveTitle('Haibiao Zhang');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.locator('.profile-identity').getByRole('heading')).toContainText('张海彪');
  await expect(page.locator('#about')).toContainText('回旋管');
  await expect(page.locator('#intellectual-property')).toContainText('已授权发明专利');
  await expect(page.locator('#opensource')).toContainText('核心贡献者');
  await expect(page.locator('#ongoing-research')).toContainText('AAAI 2027 · 在审');
  await expect(page.locator('.profile-avatar')).toHaveAttribute('alt', '张海彪头像');
  await expect(page.locator('#publications .paper-figure img').first()).toHaveAttribute('alt', '回旋管异常射频振荡的数据驱动故障诊断');
  await expect(page.locator('#ongoing-research .paper-figure img')).toHaveAttribute('alt', /框架图$/);
  await expect(page.locator('#intellectual-property .ip-document-preview img').first()).toHaveAttribute('alt', 'CN 120029768 B 发明专利记录');
  await expect(page.getByRole('link', { name: /Download CV|下载简历/ })).toHaveCount(0);

  await page.reload();
  await expect(page).toHaveTitle('Haibiao Zhang');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.locator('.profile-identity').getByRole('heading')).toContainText('张海彪');
  await expect(page.getByRole('button', { name: '中文' })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle('Haibiao Zhang');
});

test('shows the complete WeChat contact image and restores focus after Escape', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'WeChat' });
  await trigger.click();

  const dialog = page.getByRole('dialog');
  const image = dialog.locator('[data-dialog-image]');
  await expect(dialog).toBeVisible();
  await expect(image).toHaveAttribute('src', '/images/contact/wechat-haibiao-zhang.png');
  await expect(image).toHaveAttribute('alt', 'WeChat contact QR code for Haibiao Zhang');
  await expect(image).toHaveCSS('object-fit', 'contain');
  await expect(page.locator('body')).toHaveClass(/modal-open/);

  await page.keyboard.press('Tab');
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator('body')).not.toHaveClass(/modal-open/);
});

test('opens publication and certificate images and closes with button and backdrop', async ({ page }) => {
  const dialog = page.getByRole('dialog');
  const image = dialog.locator('[data-dialog-image]');
  const publicationTrigger = page.locator('#publications [data-modal-open]').first();

  await publicationTrigger.scrollIntoViewIfNeeded();
  await publicationTrigger.click();
  await expect(image).toHaveAttribute('src', '/images/publications/rf-oscillation-diagnosis.jpg');
  await dialog.getByRole('button', { name: 'Close preview' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(publicationTrigger).toBeFocused();

  const certificateTrigger = page.locator('#intellectual-property [data-modal-open]').first();
  await certificateTrigger.scrollIntoViewIfNeeded();
  await certificateTrigger.click();
  await expect(image).toHaveAttribute('src', '/images/ip/cn120029768b.png');
  await dialog.click({ position: { x: 1, y: 1 } });
  await expect(dialog).not.toBeVisible();
  await expect(certificateTrigger).toBeFocused();
});

test('mobile navigation exposes every available section and closes after navigation', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only interaction');
  const menu = page.locator('.menu-toggle');
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Publications' })).toBeVisible();
  await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Skills' })).toBeVisible();
  await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Open Source' })).toBeVisible();

  await page.locator('#mobile-menu').getByRole('link', { name: 'Open Source' }).click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expectNoHorizontalOverflow(page);
});

test('reduced-motion users receive visible content without delayed transforms', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const reveal = page.locator('.reveal').first();
  await expect(reveal).toHaveCSS('opacity', '1');
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  expect(await reveal.evaluate((element) => parseFloat(getComputedStyle(element).transitionDuration))).toBeLessThanOrEqual(0.001);
});

test('publication and timeline sections appear in the intended order', async ({ page }) => {
  const positions = await page.evaluate(() => {
    const ids = [
      'news', 'experience-education', 'publications', 'collaborative-publications',
      'ongoing-research', 'opensource', 'intellectual-property', 'skills', 'awards'
    ];
    return ids.map((id) => document.getElementById(id)?.offsetTop ?? -1);
  });
  for (let index = 1; index < positions.length; index += 1) {
    expect(positions[index]).toBeGreaterThan(positions[index - 1]);
  }
});
