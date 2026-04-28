import type { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Cart page (/#/cart).
 */
export class CartPage {
  readonly page: Page;

  readonly cartItems: Locator;
  readonly clearCartButton: Locator;
  readonly proceedToCheckout: Locator;
  readonly subtotal: Locator;
  readonly cartTotal: Locator;
  readonly discountInput: Locator;
  readonly applyDiscountButton: Locator;
  readonly discountAmount: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByTestId('cart-item');
    this.clearCartButton = page.getByTestId('clear-cart');
    this.proceedToCheckout = page.getByTestId('proceed-to-checkout');
    this.subtotal = page.getByTestId('subtotal');
    this.cartTotal = page.getByTestId('cart-total');
    this.discountInput = page.getByTestId('discount-input');
    this.applyDiscountButton = page.getByTestId('apply-discount');
    this.discountAmount = page.getByTestId('discount-amount');
    this.emptyCartMessage = page.getByTestId('continue-shopping-empty');
  }

  async goto(): Promise<void> {
    await this.page.goto('/#/cart');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async removeFirstItem(): Promise<void> {
    await this.page.getByTestId('remove-item').first().click();
  }

  async increaseQty(index = 0): Promise<void> {
    await this.page.getByTestId('qty-increase').nth(index).click();
  }

  async decreaseQty(index = 0): Promise<void> {
    await this.page.getByTestId('qty-decrease').nth(index).click();
  }

  async getQtyValue(index = 0): Promise<number> {
    const text = await this.page.getByTestId('qty-value').nth(index).innerText();
    return parseInt(text, 10);
  }

  async applyDiscount(code: string): Promise<void> {
    await this.discountInput.fill(code);
    await this.applyDiscountButton.click();
  }
}
