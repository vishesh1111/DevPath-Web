import { test, expect } from '@playwright/test';

test('homepage has correct title and essential sections', async ({ page }) => {
  await page.goto('/');

  // Check title
  await expect(page).toHaveTitle(/DevPath/i);

  // Check hero section text
  await expect(page.locator('h1')).toContainText('Ambitious Developers');

  // Verify navigation to signup works
  const signUpButton = page.locator('a[href="/signup"]').first();
  await expect(signUpButton).toBeVisible();
});
