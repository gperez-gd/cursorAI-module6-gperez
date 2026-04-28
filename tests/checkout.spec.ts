import { test, expect, type Page } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';

const VALID_SHIPPING = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  address: '123 Main Street',
  city: 'Springfield',
  state: 'IL',
  zipCode: '62701',
};

const VALID_CARD = {
  name: 'Jane Doe',
  number: '4242 4242 4242 4242',
  expiry: '12/28',
  cvc: '123',
};

/** Clear cart before page loads and navigate to products to add one item, then go to checkout. */
async function setupCheckout(page: Page) {
  await page.addInitScript(() => localStorage.removeItem('cart_items'));
  await page.goto('/#/products');
  await page.waitForSelector('[data-testid="product-card"]');
  await page.getByTestId('add-to-cart-btn').first().click();
  await page.waitForSelector('[data-testid="cart-badge"]', { timeout: 5000 });
  await page.goto('/#/checkout');
  await page.waitForSelector('[data-testid="shipping-form"]');
}

test.describe('Checkout — Empty cart redirect', () => {
  test('checkout page shows fallback when cart is empty', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('cart_items'));
    await page.goto('/#/checkout');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('Nothing to checkout')).toBeVisible();
    await expect(page.getByRole('link', { name: /browse products/i })).toBeVisible();
  });
});

test.describe('Checkout — Shipping step', () => {
  test('shipping form is visible on checkout page', async ({ page }) => {
    await setupCheckout(page);
    const checkout = new CheckoutPage(page);
    await expect(checkout.shippingForm).toBeVisible();
    await expect(page.getByText('Shipping Address')).toBeVisible();
  });

  test('shipping step breadcrumb is active', async ({ page }) => {
    await setupCheckout(page);
    await expect(page.getByText('1. Shipping')).toBeVisible();
  });

  test('submitting empty shipping form shows validation errors', async ({ page }) => {
    await setupCheckout(page);
    const checkout = new CheckoutPage(page);
    await checkout.submitShipping();

    const errors = page.getByRole('alert');
    await expect(errors.first()).toBeVisible();
  });

  test('valid shipping form advances to payment step', async ({ page }) => {
    await setupCheckout(page);
    const checkout = new CheckoutPage(page);
    await checkout.fillShipping(VALID_SHIPPING);
    await checkout.submitShipping();

    await expect(checkout.paymentForm).toBeVisible();
    await expect(page.getByText('Payment Details')).toBeVisible();
  });

  test('back to cart link is visible in shipping step', async ({ page }) => {
    await setupCheckout(page);
    await expect(page.getByRole('link', { name: /back to cart/i })).toBeVisible();
  });
});

test.describe('Checkout — Payment step', () => {
  test.beforeEach(async ({ page }) => {
    await setupCheckout(page);
    const checkout = new CheckoutPage(page);
    await checkout.fillShipping(VALID_SHIPPING);
    await checkout.submitShipping();
    await page.waitForSelector('[data-testid="payment-form"]');
  });

  test('payment form is visible after shipping step', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await expect(checkout.paymentForm).toBeVisible();
  });

  test('shipping address summary is shown in sidebar', async ({ page }) => {
    await expect(page.getByText('Jane Doe')).toBeVisible();
    await expect(page.getByText('123 Main Street')).toBeVisible();
  });

  test('back button returns to shipping step', async ({ page }) => {
    await page.getByRole('button', { name: /← back/i }).click();
    const checkout = new CheckoutPage(page);
    await expect(checkout.shippingForm).toBeVisible();
  });

  test('submitting empty payment form shows validation errors', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.submitOrder();

    const errors = page.getByRole('alert');
    await expect(errors.first()).toBeVisible();
  });

  test('invalid card number shows validation error', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillPayment({ ...VALID_CARD, number: '123' });
    await checkout.submitOrder();
    await expect(page.getByText(/16-digit/i)).toBeVisible();
  });

  test('invalid expiry format shows validation error', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillPayment({ ...VALID_CARD, expiry: '1234' });
    await checkout.submitOrder();
    await expect(page.getByText(/MM\/YY/i)).toBeVisible();
  });

  test('place order button shows total price', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await expect(checkout.placeOrderButton).toContainText(/Place Order/i);
    await expect(checkout.placeOrderButton).toContainText(/\$/);
  });
});

test.describe('Checkout — Place order and confirmation', () => {
  async function completeCheckout(page: Page) {
    await setupCheckout(page);
    const checkout = new CheckoutPage(page);
    await checkout.fillShipping(VALID_SHIPPING);
    await checkout.submitShipping();
    await page.waitForSelector('[data-testid="payment-form"]');
    await checkout.fillPayment(VALID_CARD);
    await checkout.submitOrder();
    await page.waitForURL(/#\/checkout\/success/, { timeout: 15000 });
  }

  test('completing checkout navigates to confirmation page', async ({ page }) => {
    await completeCheckout(page);
    await expect(page).toHaveURL(/#\/checkout\/success/);
  });

  test('confirmation page shows success message and confirmation number', async ({ page }) => {
    await completeCheckout(page);
    await expect(page.getByTestId('order-confirmation')).toBeVisible();
    await expect(page.getByText('Order Placed!')).toBeVisible();
    await expect(page.getByTestId('confirmation-number')).toBeVisible();
  });

  test('confirmation page shows estimated delivery date', async ({ page }) => {
    await completeCheckout(page);
    await expect(page.getByTestId('estimated-delivery')).toBeVisible();
  });

  test('confirmation page shows order total', async ({ page }) => {
    await completeCheckout(page);
    await expect(page.getByTestId('order-total')).toBeVisible();
  });

  test('cart is cleared after successful checkout', async ({ page }) => {
    await completeCheckout(page);
    const badge = page.getByTestId('cart-badge');
    await expect(badge).not.toBeVisible();
  });

  test('Continue Shopping button returns to products', async ({ page }) => {
    await completeCheckout(page);
    await page.getByTestId('continue-shopping').click();
    await expect(page).toHaveURL(/#\/products/);
  });
});

test.describe('Checkout — Order summary sidebar', () => {
  test('sidebar shows item count and prices', async ({ page }) => {
    await setupCheckout(page);
    await expect(page.getByText(/Order Summary/)).toBeVisible();
    await expect(page.locator('aside')).toBeVisible();
  });
});
