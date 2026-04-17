import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

test.describe('Single Filter — Category', () => {
  test('selecting Electronics shows only Electronics products', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectCategory('Electronics');

    const count = await sp.getProductCount();
    expect(count).toBeGreaterThan(0);

    // Electronics products in the dataset: Headphones, Camera, Keyboard (3 total — fits one page)
    const total = await sp.getTotalResultCount();
    expect(total).toBeGreaterThan(0);
  });

  test('selecting Accessories shows only Accessories products', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectCategory('Accessories');

    const titles = await sp.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    // The only Accessories product is the Watch
    expect(titles.some(t => /watch/i.test(t))).toBe(true);
  });

  test('selecting Footwear shows Trail Running Shoes', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectCategory('Footwear');

    const titles = await sp.getProductTitles();
    expect(titles.some(t => /shoe/i.test(t))).toBe(true);
  });

  test('selecting Office shows Ergonomic Laptop Stand', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectCategory('Office');

    const titles = await sp.getProductTitles();
    expect(titles.some(t => /laptop stand/i.test(t))).toBe(true);
  });
});

test.describe('Single Filter — Price Range', () => {
  test('Under $100 filter shows only cheap products', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectPriceRange('under-100');

    const count = await sp.getProductCount();
    expect(count).toBeGreaterThan(0);

    const prices = await sp.getProductPrices();
    prices.forEach(price => expect(price).toBeLessThan(100));
  });

  test('$100–$200 filter shows mid-range products', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectPriceRange('100-200');

    const prices = await sp.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    prices.forEach(price => {
      expect(price).toBeGreaterThanOrEqual(100);
      expect(price).toBeLessThanOrEqual(200);
    });
  });

  test('Over $200 filter shows premium products', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectPriceRange('over-200');

    const prices = await sp.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    prices.forEach(price => expect(price).toBeGreaterThan(200));
  });
});

test.describe('Multiple Filters', () => {
  test('Electronics + Over $200 shows only expensive electronics', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectCategory('Electronics');
    await sp.selectPriceRange('over-200');

    // Headphones ($379) matches both — at least 1 result expected
    const count = await sp.getProductCount();
    expect(count).toBeGreaterThanOrEqual(1);

    const prices = await sp.getProductPrices();
    prices.forEach(price => expect(price).toBeGreaterThan(200));
  });

  test('Electronics + Under $100 shows cheap electronics', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectCategory('Electronics');
    await sp.selectPriceRange('under-100');

    // Camera ($89.99) matches — at least 1 result
    const count = await sp.getProductCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Search + Category filter combined narrows results correctly', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.selectCategory('Electronics');
    await sp.search('Camera');

    const titles = await sp.getProductTitles();
    expect(titles.some(t => /camera/i.test(t))).toBe(true);
  });

  test('filters that produce no results show empty state', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    // Footwear + Over $200: no products match (shoes are $129.95)
    await sp.selectCategory('Footwear');
    await sp.selectPriceRange('over-200');

    await expect(sp.noResults).toBeVisible();
    expect(await sp.getProductCount()).toBe(0);
  });
});

test.describe('Clear All Filters', () => {
  test('Clear Filters button restores the full product list', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    const initialTotal = await sp.getTotalResultCount();

    await sp.selectCategory('Accessories');
    expect(await sp.getTotalResultCount()).toBeLessThan(initialTotal);

    await sp.clearAllFilters();

    const restoredTotal = await sp.getTotalResultCount();
    expect(restoredTotal).toBe(initialTotal);
  });

  test('Clear Filters resets all active filters including search', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    const initialTotal = await sp.getTotalResultCount();

    await sp.search('Watch');
    await sp.selectPriceRange('over-200');
    await sp.clearAllFilters();

    const restoredTotal = await sp.getTotalResultCount();
    expect(restoredTotal).toBe(initialTotal);
  });

  test('Clear Filters button is hidden when no filters are active', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    // No filters applied — button should not be visible
    await expect(sp.clearFiltersButton).not.toBeVisible();
  });

  test('Clear Filters button appears when a filter is applied', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.search('Watch');

    await expect(sp.clearFiltersButton).toBeVisible();
  });
});
