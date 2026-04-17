import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

test.describe('Product Search — Happy Paths', () => {
  test('valid query returns matching results', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.search('Watch');

    const count = await sp.getProductCount();
    expect(count).toBeGreaterThan(0);

    const titles = await sp.getProductTitles();
    expect(titles.some(t => /watch/i.test(t))).toBe(true);
  });

  test('search is case-insensitive', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.search('keyboard');

    const titles = await sp.getProductTitles();
    expect(titles.some(t => /keyboard/i.test(t))).toBe(true);
  });

  test('description text is also searchable', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    // "sapphire" appears in Watch description, not title
    await sp.search('sapphire');

    const count = await sp.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('result count reflects the number of matches', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.search('Camera');

    const resultTotal = await sp.getTotalResultCount();
    const shownCount = await sp.getProductCount();
    expect(shownCount).toBeGreaterThan(0);
    expect(shownCount).toBeLessThanOrEqual(resultTotal);
  });
});

test.describe('Product Search — No Results', () => {
  test('query with no matches shows empty state', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.search('xyznonexistentproduct99999');

    await expect(sp.noResults).toBeVisible();
    expect(await sp.getProductCount()).toBe(0);
  });

  test('result count shows zero when no products match', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.search('zzzyyyxxx___nomatch');

    const text = await sp.getResultText();
    expect(text).toMatch(/^0/);
  });
});

test.describe('Product Search — Edge Cases', () => {
  test('empty string after clearing search restores all products', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    const initialCount = await sp.getTotalResultCount();

    await sp.search('Watch');
    await sp.clearSearch();

    const restoredCount = await sp.getTotalResultCount();
    expect(restoredCount).toBe(initialCount);
  });

  test('whitespace-only query shows all products', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.search('   ');

    const count = await sp.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('special characters do not crash the page', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.search('<script>alert(1)</script>');

    // Page must still be functional — either shows results or empty state
    const noResultsVisible = await sp.noResults.isVisible().catch(() => false);
    const productsVisible = (await sp.getProductCount()) > 0;
    expect(noResultsVisible || productsVisible).toBe(true);
  });

  test('very long query is handled gracefully', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.search('A'.repeat(500));

    // Page must remain functional
    const isStable = await page.locator('body').isVisible();
    expect(isStable).toBe(true);
  });
});
