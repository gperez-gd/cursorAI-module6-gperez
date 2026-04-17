import type { Page, Locator } from '@playwright/test';

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'name-asc'
  | 'name-desc';

export type PriceRange = 'all' | 'under-100' | '100-200' | 'over-200';

/**
 * Page Object Model for the product search / catalog page (/#/products).
 */
export class SearchPage {
  readonly page: Page;

  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly priceFilter: Locator;
  readonly sortSelect: Locator;
  readonly clearFiltersButton: Locator;

  readonly productCards: Locator;
  readonly noResults: Locator;
  readonly resultCount: Locator;

  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly pageInfo: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.getByTestId('search-input');
    this.categoryFilter = page.getByTestId('category-filter');
    this.priceFilter = page.getByTestId('price-filter');
    this.sortSelect = page.getByTestId('sort-select');
    this.clearFiltersButton = page.getByTestId('clear-filters');

    this.productCards = page.getByTestId('product-card');
    this.noResults = page.getByTestId('no-results');
    this.resultCount = page.getByTestId('result-count');

    this.prevPageButton = page.getByTestId('pagination-prev');
    this.nextPageButton = page.getByTestId('pagination-next');
    this.pageInfo = page.getByTestId('page-info');
  }

  async goto(): Promise<void> {
    await this.page.goto('/#/products');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  async selectCategory(category: string): Promise<void> {
    await this.categoryFilter.selectOption(category);
  }

  async selectPriceRange(range: PriceRange): Promise<void> {
    await this.priceFilter.selectOption(range);
  }

  async selectSort(sort: SortOption): Promise<void> {
    await this.sortSelect.selectOption(sort);
  }

  async clearAllFilters(): Promise<void> {
    await this.clearFiltersButton.click();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async getProductTitles(): Promise<string[]> {
    const count = await this.productCards.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const heading = this.productCards.nth(i).locator('h2');
      titles.push(await heading.innerText());
    }
    return titles;
  }

  async getResultText(): Promise<string> {
    return this.resultCount.innerText();
  }

  async getTotalResultCount(): Promise<number> {
    const text = await this.getResultText();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getPageInfoText(): Promise<string> {
    return this.pageInfo.innerText();
  }

  async goToNextPage(): Promise<void> {
    await this.nextPageButton.click();
  }

  async goToPrevPage(): Promise<void> {
    await this.prevPageButton.click();
  }

  async isNextPageDisabled(): Promise<boolean> {
    return this.nextPageButton.isDisabled();
  }

  async isPrevPageDisabled(): Promise<boolean> {
    return this.prevPageButton.isDisabled();
  }

  /** Returns prices extracted from the aria-labels or h2 headings of visible product cards. */
  async getProductPrices(): Promise<number[]> {
    const count = await this.productCards.count();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const priceText = await this.productCards
        .nth(i)
        .locator('span.text-2xl')
        .innerText()
        .catch(() => '');
      const cleaned = priceText.replace(/[^0-9.]/g, '');
      if (cleaned) prices.push(parseFloat(cleaned));
    }
    return prices;
  }
}
