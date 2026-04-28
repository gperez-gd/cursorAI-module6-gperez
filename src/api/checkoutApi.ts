import { api } from './client';

const CSRF_KEY = 'auth_csrf';

/** Shipping as collected in the checkout form (client). */
export interface ShippingAddressForm {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  countryCode: string;
}

/** Stored on last order for confirmation page display (same shape as the form). */
export type ShippingAddressDisplay = ShippingAddressForm;

export interface CheckoutPayload {
  shippingAddress: ShippingAddressForm;
  paymentToken: string;
  idempotencyKey: string;
  discountCode?: string;
}

export interface CheckoutResult {
  orderId: string;
  confirmationNumber: string;
  total: number;
  estimatedDelivery: string;
  status: string;
}

/** Body shape expected by POST /api/v1/checkout (e-commerce API). */
export function toCheckoutRequestBody(payload: CheckoutPayload) {
  const { shippingAddress: s, paymentToken, idempotencyKey, discountCode } = payload;
  return {
    shippingAddress: {
      firstName: s.firstName.trim(),
      lastName: s.lastName.trim(),
      email: s.email.trim(),
      street: s.address.trim(),
      city: s.city.trim(),
      state: s.state.trim(),
      zip: s.zipCode.trim(),
      country: s.countryCode,
    },
    paymentToken: paymentToken || undefined,
    discountCode: discountCode?.trim() || undefined,
    idempotencyKey,
  };
}

export const checkoutApi = {
  submit(payload: CheckoutPayload) {
    const csrf = localStorage.getItem(CSRF_KEY);
    const body = toCheckoutRequestBody(payload);
    return api
      .post<CheckoutResult>('/checkout', body, {
        headers: csrf ? { 'X-CSRF-Token': csrf } : {},
      })
      .then(r => r.data);
  },
};
