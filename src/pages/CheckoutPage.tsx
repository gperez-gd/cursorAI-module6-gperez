import { useState, useId } from 'react';
import axios from 'axios';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import { checkoutApi } from '../api/checkoutApi';
import type { ShippingAddressForm } from '../api/checkoutApi';
import { COUNTRY_OPTIONS } from '../api/countries';

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function estimatedDelivery(): string {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatEstimatedFromApi(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

interface FieldProps {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, id, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1" role="alert">{error}</p>}
    </div>
  );
}

const inputCls = `w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
  focus:outline-none focus:ring-2 focus:ring-primary transition text-sm`;

function checkoutErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string; message?: string } | undefined;
    if (typeof data?.error === 'string') return data.error;
    if (typeof data?.message === 'string') return data.message;
    if (err.response?.status === 401) return 'Please sign in to complete checkout.';
    if (err.response?.status === 403) return 'Security check failed. Try signing out and back in.';
    if (err.response?.status === 402) return 'Payment was declined. Please try another method.';
  }
  return 'Checkout could not be completed. Please try again.';
}

export default function CheckoutPage() {
  const { items, subtotal, discountAmount, total, discountCode, clearCart, setLastOrder } = useCart();
  const { user } = useAuth();

  const uid = useId();
  const [step, setStep] = useState<'shipping' | 'payment' | 'submitting'>('shipping');
  const [submitError, setSubmitError] = useState('');

  const [ship, setShip] = useState<ShippingAddressForm>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    countryCode: 'US',
  });
  const [shipErrors, setShipErrors] = useState<Partial<Record<keyof ShippingAddressForm, string>>>({});

  const userEmail = user?.email;
  const [lastSyncedAuthEmail, setLastSyncedAuthEmail] = useState<string | undefined>(undefined);
  if (!userEmail) {
    if (lastSyncedAuthEmail !== undefined) {
      setLastSyncedAuthEmail(undefined);
    }
  } else if (userEmail !== lastSyncedAuthEmail) {
    setLastSyncedAuthEmail(userEmail);
    setShip(s => (s.email ? s : { ...s, email: userEmail }));
  }

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [payErrors, setPayErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Nothing to checkout</h1>
        <a href="#/products" className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition">
          Browse Products
        </a>
      </div>
    );
  }

  function validateShipping(): boolean {
    const errs: Partial<Record<keyof ShippingAddressForm, string>> = {};
    if (!ship.firstName.trim()) errs.firstName = 'Required';
    if (!ship.lastName.trim()) errs.lastName = 'Required';
    if (!ship.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ship.email.trim())) errs.email = 'Enter a valid email';
    if (!ship.address.trim()) errs.address = 'Required';
    if (!ship.city.trim()) errs.city = 'Required';
    if (!ship.state.trim()) errs.state = 'Required';
    if (!ship.zipCode.trim()) errs.zipCode = 'Required';
    if (!ship.countryCode.trim()) errs.countryCode = 'Required';
    setShipErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validatePayment(): boolean {
    const errs: Record<string, string> = {};
    if (!cardName.trim()) errs.cardName = 'Required';
    if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) errs.cardNumber = 'Enter a 16-digit card number';
    if (!cardExpiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) errs.cardExpiry = 'Use MM/YY format';
    if (!cardCvc.match(/^\d{3,4}$/)) errs.cardCvc = 'Enter 3-4 digit CVV';
    setPayErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleShipNext(e: React.FormEvent) {
    e.preventDefault();
    if (validateShipping()) setStep('payment');
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!validatePayment()) return;

    setStep('submitting');
    setSubmitError('');

    const idempotencyKey = generateId();
    const delivery = estimatedDelivery();

    const fallbackOrder = () => {
      setLastOrder({
        orderId: idempotencyKey,
        confirmationNumber: 'ORD-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
        total,
        subtotal,
        discount: discountAmount,
        estimatedDelivery: delivery,
        items: [...items],
        shippingAddress: { ...ship },
      });
    };

    try {
      const result = await checkoutApi.submit({
        shippingAddress: ship,
        paymentToken: 'tok_visa',
        idempotencyKey,
        discountCode: discountCode || undefined,
      });

      setLastOrder({
        orderId: result.orderId,
        confirmationNumber: result.confirmationNumber,
        total: result.total,
        subtotal,
        discount: discountAmount,
        estimatedDelivery: result.estimatedDelivery
          ? formatEstimatedFromApi(result.estimatedDelivery)
          : delivery,
        items: [...items],
        shippingAddress: { ...ship },
      });
    } catch (err: unknown) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      if (status === 400 || status === 401 || status === 402 || status === 403) {
        setSubmitError(checkoutErrorMessage(err));
        setStep('payment');
        return;
      }
      fallbackOrder();
    }

    clearCart();
    window.location.hash = '#/checkout/success';
  }

  function formatCardNumber(raw: string) {
    return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <nav aria-label="Checkout steps" className="mb-8">
          <ol className="flex items-center gap-3 text-sm">
            <li className={`font-semibold ${step === 'shipping' ? 'text-primary' : 'text-gray-400'}`}>
              1. Shipping
            </li>
            <li className="text-gray-300 dark:text-gray-600">›</li>
            <li className={`font-semibold ${step === 'payment' || step === 'submitting' ? 'text-primary' : 'text-gray-400'}`}>
              2. Payment
            </li>
            <li className="text-gray-300 dark:text-gray-600">›</li>
            <li className="text-gray-400 font-semibold">3. Confirm</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">

          <div className="flex-1">

            {step === 'shipping' && (
              <form
                onSubmit={handleShipNext}
                noValidate
                data-testid="shipping-form"
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name" id={uid + '-fn'} error={shipErrors.firstName}>
                    <input
                      id={uid + '-fn'}
                      type="text"
                      value={ship.firstName}
                      onChange={e => setShip(s => ({ ...s, firstName: e.target.value }))}
                      autoComplete="given-name"
                      data-testid="ship-first-name"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Last Name" id={uid + '-ln'} error={shipErrors.lastName}>
                    <input
                      id={uid + '-ln'}
                      type="text"
                      value={ship.lastName}
                      onChange={e => setShip(s => ({ ...s, lastName: e.target.value }))}
                      autoComplete="family-name"
                      data-testid="ship-last-name"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Email" id={uid + '-em'} error={shipErrors.email}>
                    <input
                      id={uid + '-em'}
                      type="email"
                      value={ship.email}
                      onChange={e => setShip(s => ({ ...s, email: e.target.value }))}
                      autoComplete="email"
                      data-testid="ship-email"
                      className={`${inputCls} sm:col-span-2`}
                    />
                  </Field>
                  <Field label="Street Address" id={uid + '-addr'} error={shipErrors.address}>
                    <input
                      id={uid + '-addr'}
                      type="text"
                      value={ship.address}
                      onChange={e => setShip(s => ({ ...s, address: e.target.value }))}
                      autoComplete="street-address"
                      data-testid="ship-address"
                      className={`${inputCls} sm:col-span-2`}
                    />
                  </Field>
                  <Field label="City" id={uid + '-city'} error={shipErrors.city}>
                    <input
                      id={uid + '-city'}
                      type="text"
                      value={ship.city}
                      onChange={e => setShip(s => ({ ...s, city: e.target.value }))}
                      autoComplete="address-level2"
                      data-testid="ship-city"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="State / Province" id={uid + '-state'} error={shipErrors.state}>
                    <input
                      id={uid + '-state'}
                      type="text"
                      value={ship.state}
                      onChange={e => setShip(s => ({ ...s, state: e.target.value }))}
                      autoComplete="address-level1"
                      data-testid="ship-state"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="ZIP / Postal Code" id={uid + '-zip'} error={shipErrors.zipCode}>
                    <input
                      id={uid + '-zip'}
                      type="text"
                      value={ship.zipCode}
                      onChange={e => setShip(s => ({ ...s, zipCode: e.target.value }))}
                      autoComplete="postal-code"
                      data-testid="ship-zip"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Country" id={uid + '-country'} error={shipErrors.countryCode}>
                    <select
                      id={uid + '-country'}
                      value={ship.countryCode}
                      onChange={e => setShip(s => ({ ...s, countryCode: e.target.value }))}
                      data-testid="ship-country"
                      className={inputCls}
                    >
                      {COUNTRY_OPTIONS.map(c => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="flex gap-3 mt-6">
                  <a href="#/cart" className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                    text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    ← Back to Cart
                  </a>
                  <button
                    type="submit"
                    data-testid="continue-to-payment"
                    className="flex-1 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm
                      hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </form>
            )}

            {(step === 'payment' || step === 'submitting') && (
              <form
                onSubmit={handlePlaceOrder}
                noValidate
                data-testid="payment-form"
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Payment Details</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                  🔒 Test mode — use card <strong>4242 4242 4242 4242</strong>, any future date, any CVV.
                </p>

                <div className="flex flex-col gap-4">
                  <Field label="Name on Card" id={uid + '-cn'} error={payErrors.cardName}>
                    <input
                      id={uid + '-cn'}
                      type="text"
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      autoComplete="cc-name"
                      data-testid="card-name"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Card Number" id={uid + '-cnum'} error={payErrors.cardNumber}>
                    <input
                      id={uid + '-cnum'}
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      data-testid="card-number"
                      className={inputCls}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry (MM/YY)" id={uid + '-exp'} error={payErrors.cardExpiry}>
                      <input
                        id={uid + '-exp'}
                        type="text"
                        inputMode="numeric"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                        autoComplete="cc-exp"
                        placeholder="MM/YY"
                        maxLength={5}
                        data-testid="card-expiry"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="CVV" id={uid + '-cvc'} error={payErrors.cardCvc}>
                      <input
                        id={uid + '-cvc'}
                        type="text"
                        inputMode="numeric"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        autoComplete="cc-csc"
                        placeholder="123"
                        maxLength={4}
                        data-testid="card-cvc"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </div>

                {submitError && (
                  <p className="text-sm text-red-600 mt-4 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2" role="alert">
                    {submitError}
                  </p>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                      text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={step === 'submitting'}
                    data-testid="place-order"
                    className="flex-1 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm
                      hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {step === 'submitting' ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Processing…
                      </>
                    ) : (
                      `Place Order · ${formatPrice(total)}`
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-base">
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h3>
              <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                {items.map(item => (
                  <li key={item.id} className="flex gap-3 items-start text-sm">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">
                        {item.title}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="space-y-1.5 text-sm border-t border-gray-100 dark:border-gray-700 pt-3">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base border-t border-gray-100 dark:border-gray-700 pt-2 mt-1">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {step === 'payment' && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3 text-xs text-gray-500 dark:text-gray-400">
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Shipping to:</p>
                  <p>{ship.firstName} {ship.lastName}</p>
                  <p>{ship.email}</p>
                  <p>{ship.address}</p>
                  <p>{ship.city}, {ship.state} {ship.zipCode}</p>
                  <p>{COUNTRY_OPTIONS.find(c => c.code === ship.countryCode)?.label ?? ship.countryCode}</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
