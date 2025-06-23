const { test, expect } = require('@playwright/test');

test('Cross-browser rendering test', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
  // Additional cross-browser assertions can be added here
});