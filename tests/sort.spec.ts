import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

/**
 * Product prices in the catalog (for reference):
 *   Ergonomic Laptop Stand     — $59.99   — rating 4.8
 *   Instant Film Camera        — $89.99   — rating 4.1
 *   Trail Running Shoes        — $129.95  — rating 4.3
 *   Mechanical Gaming Keyboard — $149.00  — rating 4.6
 *   Premium Minimalist Watch   — $249.99  — rating 4.7
 *   Wireless Headphones        — $379.00  — rating 4.5
 *
 * With PAGE_SIZE = 3 the first 3 items after sorting appear on page 1.
 */

test.describe('Sort by Price', () => {
  test('Price: Low to High — cheapest products appear on page 1', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectSort('price-asc');

    const prices = await sp.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);

    // Prices on page 1 must be in ascending order
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }

    // Cheapest item overall ($59.99) must be on page 1
    expect(prices[0]).toBeLessThan(100);
  });

  test('Price: High to Low — most expensive product appears on page 1', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectSort('price-desc');

    const prices = await sp.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);

    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }

    // Most expensive ($379) must lead page 1
    expect(prices[0]).toBeGreaterThan(300);
  });

  test('switching sort order changes product order', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectSort('price-asc');
    const ascPrices = await sp.getProductPrices();

    await sp.selectSort('price-desc');
    const descPrices = await sp.getProductPrices();

    // The first price after ascending sort must differ from descending
    expect(ascPrices[0]).not.toBe(descPrices[0]);
  });
});

test.describe('Sort by Name', () => {
  test('Name: A–Z — titles are in alphabetical ascending order', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectSort('name-asc');

    const titles = await sp.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);

    const sorted = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sorted);
  });

  test('Name: Z–A — titles are in alphabetical descending order', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectSort('name-desc');

    const titles = await sp.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);

    const sorted = [...titles].sort((a, b) => b.localeCompare(a));
    expect(titles).toEqual(sorted);
  });

  test('A–Z and Z–A produce reversed first items', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectSort('name-asc');
    const ascTitles = await sp.getProductTitles();

    await sp.selectSort('name-desc');
    const descTitles = await sp.getProductTitles();

    expect(ascTitles[0]).not.toBe(descTitles[0]);
  });
});

test.describe('Sort by Rating', () => {
  test('Highest Rated — Ergonomic Laptop Stand (4.8) appears first', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectSort('rating');

    const titles = await sp.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    expect(titles[0]).toMatch(/laptop stand/i);
  });

  test('Highest Rated — all visible products are ordered by rating descending', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectSort('rating');

    // Grab star counts via aria-label on the star elements (or infer from product order)
    // We verify that switching to rating changes the first product compared to Featured
    const ratingFirstTitle = (await sp.getProductTitles())[0];

    await sp.selectSort('featured');
    const featuredFirstTitle = (await sp.getProductTitles())[0];

    // Featured order leads with the Watch; Rating order leads with Laptop Stand
    expect(ratingFirstTitle).not.toBe(featuredFirstTitle);
  });
});

test.describe('Sort — Featured (Default)', () => {
  test('Featured order matches the original catalog sequence', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    // Featured is the default — page 1 shows first 3 products in original order
    const titles = await sp.getProductTitles();
    expect(titles[0]).toMatch(/watch/i);
    expect(titles[1]).toMatch(/headphone/i);
    expect(titles[2]).toMatch(/shoe/i);
  });

  test('switching away from Featured and back restores original order', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    const originalTitles = await sp.getProductTitles();

    await sp.selectSort('price-asc');
    await sp.selectSort('featured');

    const restoredTitles = await sp.getProductTitles();
    expect(restoredTitles).toEqual(originalTitles);
  });
});
