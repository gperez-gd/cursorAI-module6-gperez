import type { Page, Locator } from '@playwright/test';

export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CardData {
  name: string;
  number: string;
  expiry: string;
  cvc: string;
}

/**
 * Page Object Model for the Checkout page (/#/checkout).
 */
export class CheckoutPage {
  readonly page: Page;

  readonly shippingForm: Locator;
  readonly paymentForm: Locator;
  readonly continueToPayment: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shippingForm = page.getByTestId('shipping-form');
    this.paymentForm = page.getByTestId('payment-form');
    this.continueToPayment = page.getByTestId('continue-to-payment');
    this.placeOrderButton = page.getByTestId('place-order');
  }

  async goto(): Promise<void> {
    await this.page.goto('/#/checkout');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillShipping(data: ShippingData): Promise<void> {
    await this.page.getByTestId('ship-first-name').fill(data.firstName);
    await this.page.getByTestId('ship-last-name').fill(data.lastName);
    await this.page.getByTestId('ship-email').fill(data.email);
    await this.page.getByTestId('ship-address').fill(data.address);
    await this.page.getByTestId('ship-city').fill(data.city);
    await this.page.getByTestId('ship-state').fill(data.state);
    await this.page.getByTestId('ship-zip').fill(data.zipCode);
  }

  async submitShipping(): Promise<void> {
    await this.continueToPayment.click();
  }

  async fillPayment(data: CardData): Promise<void> {
    await this.page.getByTestId('card-name').fill(data.name);
    await this.page.getByTestId('card-number').fill(data.number);
    await this.page.getByTestId('card-expiry').fill(data.expiry);
    await this.page.getByTestId('card-cvc').fill(data.cvc);
  }

  async submitOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }
}
