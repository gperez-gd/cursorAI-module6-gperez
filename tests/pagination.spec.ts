import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

// Products per page in ProductDemo is 3.
// With 6 total products the catalog has exactly 2 pages.

test.describe('Pagination — Navigation', () => {
  test('page 1 shows the first set of products and Previous is disabled', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await expect(sp.prevPageButton).toBeDisabled();
    await expect(sp.nextPageButton).toBeEnabled();

    const pageText = await sp.getPageInfoText();
    expect(pageText).toMatch(/page 1/i);
  });

  test('Next navigates to page 2 and shows different products', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    const page1Titles = await sp.getProductTitles();
    await sp.goToNextPage();

    const pageText = await sp.getPageInfoText();
    expect(pageText).toMatch(/page 2/i);

    const page2Titles = await sp.getProductTitles();

    // Products on page 2 must differ from page 1
    const overlap = page1Titles.filter(t => page2Titles.includes(t));
    expect(overlap.length).toBe(0);
  });

  test('Previous returns to page 1 after navigating to page 2', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.goToNextPage();
    await sp.goToPrevPage();

    const pageText = await sp.getPageInfoText();
    expect(pageText).toMatch(/page 1/i);
    expect(await sp.isPrevPageDisabled()).toBe(true);
  });

  test('Next is disabled on the last page', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.goToNextPage();

    await expect(sp.nextPageButton).toBeDisabled();
  });

  test('page indicators reflect current position', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    const infoP1 = await sp.getPageInfoText();
    expect(infoP1).toMatch(/1.*2|page 1 of 2/i);

    await sp.goToNextPage();

    const infoP2 = await sp.getPageInfoText();
    expect(infoP2).toMatch(/page 2/i);
  });
});

test.describe('Pagination — Correct Products per Page', () => {
  test('page 1 shows at most PAGE_SIZE products', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    const count = await sp.getProductCount();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(3);
  });

  test('page 2 shows the remaining products', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    const total = await sp.getTotalResultCount();
    const page1Count = await sp.getProductCount();

    await sp.goToNextPage();

    const page2Count = await sp.getProductCount();
    expect(page1Count + page2Count).toBe(total);
  });
});

test.describe('Pagination — Boundary Pages', () => {
  test('first page: Previous is disabled and Next is enabled', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    expect(await sp.isPrevPageDisabled()).toBe(true);
    expect(await sp.isNextPageDisabled()).toBe(false);
  });

  test('last page: Next is disabled and Previous is enabled', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.goToNextPage();

    expect(await sp.isNextPageDisabled()).toBe(true);
    expect(await sp.isPrevPageDisabled()).toBe(false);
  });
});

test.describe('Pagination — State with Filters', () => {
  test('applying a filter that reduces results resets to page 1', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    await sp.goToNextPage();
    expect(await sp.getPageInfoText()).toMatch(/page 2/i);

    await sp.selectCategory('Electronics');

    const pageText = await sp.getPageInfoText();
    // Should have been reset to page 1 (or pagination hidden if only 1 page)
    const isOnPage1 = /page 1/i.test(pageText);
    const paginationVisible = await sp.prevPageButton.isVisible().catch(() => false);
    expect(isOnPage1 || !paginationVisible).toBe(true);
  });

  test('pagination is hidden when all results fit on one page', async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.goto();

    // Accessories has 1 product — no pagination needed
    await sp.selectCategory('Accessories');

    const paginationVisible = await sp.prevPageButton.isVisible().catch(() => false);
    expect(paginationVisible).toBe(false);
  });
});
