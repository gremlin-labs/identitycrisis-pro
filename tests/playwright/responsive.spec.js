const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
];

for (const viewport of viewports) {
  test.describe(`Responsive tests - ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test(`should display header and main content correctly on ${viewport.name}`, async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      // Additional layout assertions can be added here
    });
  });
}