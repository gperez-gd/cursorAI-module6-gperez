import { test, expect } from '@playwright/test';

test.describe('Navbar — Home tab removal', () => {
  test('Home tab is not present in the desktop navigation', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    const homeLink = nav.getByRole('link', { name: 'Home' });

    await expect(homeLink).not.toBeVisible();
  });

  test('remaining nav links are still visible', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Main navigation' });

    await expect(nav.getByRole('link', { name: 'Products' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Analytics' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Kanban' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Feed' })).toBeVisible();
  });
});
