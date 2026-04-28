import { test, expect, type Page } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

/** Runs before the page loads so CartContext mounts with an empty cart. */
async function clearCartStorage(page: Page) {
  await page.addInitScript(() => localStorage.removeItem('cart_items'));
}

/** Navigate to products and click Add to Cart on the first product. */
async function addProductToCart(page: Page) {
  await page.goto('/#/products');
  await page.waitForSelector('[data-testid="product-card"]');
  await page.getByTestId('add-to-cart-btn').first().click();
  // Wait for the cart badge to appear so we know the state updated
  await page.waitForSelector('[data-testid="cart-badge"]', { timeout: 5000 });
}

test.describe('Cart — Empty state', () => {
  test('shows empty state message when cart is empty', async ({ page }) => {
    await clearCartStorage(page);
    const cart = new CartPage(page);
    await cart.goto();

    await expect(cart.emptyCartMessage).toBeVisible();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });

  test('Browse Products button navigates to products page', async ({ page }) => {
    await clearCartStorage(page);
    const cart = new CartPage(page);
    await cart.goto();

    await cart.emptyCartMessage.click();
    await expect(page).toHaveURL(/#\/products/);
  });
});

test.describe('Cart — Add items', () => {
  test('cart button in navbar shows badge after adding product', async ({ page }) => {
    await clearCartStorage(page);
    await addProductToCart(page);

    const badge = page.getByTestId('cart-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('1');
  });

  test('cart summary link appears on products page after adding item', async ({ page }) => {
    await clearCartStorage(page);
    await addProductToCart(page);

    const link = page.getByTestId('cart-summary-link');
    await expect(link).toBeVisible();
    await expect(link).toContainText('in cart');
  });

  test('cart summary link navigates to cart page', async ({ page }) => {
    await clearCartStorage(page);
    await addProductToCart(page);

    await page.getByTestId('cart-summary-link').click();
    await expect(page).toHaveURL(/#\/cart/);
  });

  test('navbar cart button navigates to cart page', async ({ page }) => {
    await clearCartStorage(page);
    await page.goto('/#/products');
    await page.waitForSelector('[data-testid="product-card"]');

    await page.getByTestId('cart-nav-button').click();
    await expect(page).toHaveURL(/#\/cart/);
  });
});

test.describe('Cart — Items', () => {
  test.beforeEach(async ({ page }) => {
    await clearCartStorage(page);
    await addProductToCart(page);
    await page.goto('/#/cart');
    await page.waitForSelector('[data-testid="cart-item"]');
  });

  test('shows one cart item after adding one product', async ({ page }) => {
    const cart = new CartPage(page);
    expect(await cart.getItemCount()).toBe(1);
  });

  test('subtotal and total are displayed', async ({ page }) => {
    const cart = new CartPage(page);
    await expect(cart.subtotal).toBeVisible();
    await expect(cart.cartTotal).toBeVisible();
  });

  test('increasing quantity updates qty value and total', async ({ page }) => {
    const cart = new CartPage(page);
    const totalBefore = await cart.cartTotal.innerText();

    await cart.increaseQty(0);
    await page.waitForTimeout(300); // allow re-render

    const qty = await cart.getQtyValue(0);
    expect(qty).toBe(2);

    const totalAfter = await cart.cartTotal.innerText();
    expect(totalAfter).not.toBe(totalBefore);
  });

  test('decrease button is disabled at quantity 1', async ({ page }) => {
    const decreaseBtn = page.getByTestId('qty-decrease').first();
    await expect(decreaseBtn).toBeDisabled();
  });

  test('removing item clears cart and shows empty state', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.removeFirstItem();
    await expect(cart.emptyCartMessage).toBeVisible();
  });

  test('proceed to checkout button navigates to checkout', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.proceedToCheckout.click();
    await expect(page).toHaveURL(/#\/checkout/);
  });
});

test.describe('Cart — Discount codes', () => {
  test.beforeEach(async ({ page }) => {
    await clearCartStorage(page);
    await addProductToCart(page);
    await page.goto('/#/cart');
    await page.waitForSelector('[data-testid="cart-item"]');
  });

  test('valid discount code SAVE10 reduces total', async ({ page }) => {
    const cart = new CartPage(page);
    const totalBefore = await cart.cartTotal.innerText();

    await cart.applyDiscount('SAVE10');

    await expect(page.getByText(/code "SAVE10" applied/i)).toBeVisible();
    const totalAfter = await cart.cartTotal.innerText();
    expect(totalAfter).not.toBe(totalBefore);
    await expect(cart.discountAmount).toBeVisible();
  });

  test('invalid discount code shows error', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.applyDiscount('INVALID99');
    await expect(page.getByText(/invalid discount code/i)).toBeVisible();
  });

  test('SAVE20 discount code works', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.applyDiscount('SAVE20');
    await expect(page.getByText(/code "SAVE20" applied/i)).toBeVisible();
  });
});

test.describe('Cart — Clear cart', () => {
  test('clear cart button empties all items', async ({ page }) => {
    await clearCartStorage(page);
    await addProductToCart(page);

    // Add a second item
    await page.goto('/#/products');
    await page.waitForSelector('[data-testid="product-card"]');
    await page.getByTestId('add-to-cart-btn').nth(1).click();
    await page.waitForTimeout(300);

    await page.goto('/#/cart');
    await page.waitForSelector('[data-testid="cart-item"]');

    const cart = new CartPage(page);
    await cart.clearCartButton.click();

    await expect(cart.emptyCartMessage).toBeVisible();
  });
});
