import { useState } from 'react';
import { useCart } from '../context/useCart';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discountCode,
    discountAmount,
    total,
    removeItem,
    updateQuantity,
    applyDiscount,
    removeDiscount,
    clearCart,
  } = useCart();

  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');

  function handleApplyDiscount() {
    setCodeError('');
    setCodeSuccess('');
    if (!codeInput.trim()) return;
    const ok = applyDiscount(codeInput.trim());
    if (ok) {
      setCodeSuccess(`Code "${codeInput.toUpperCase()}" applied!`);
      setCodeInput('');
    } else {
      setCodeError('Invalid discount code.');
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 py-20">
        <svg
          className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-6"
          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-sm">
          Looks like you haven't added anything yet. Explore our products and find something you love.
        </p>
        <a
          href="#/products"
          data-testid="continue-shopping-empty"
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Shopping Cart
            <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
              ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
          </h1>
          <button
            onClick={clearCart}
            data-testid="clear-cart"
            className="text-sm text-red-500 hover:text-red-700 transition focus:outline-none focus:underline"
          >
            Clear cart
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items list */}
          <div className="flex-1 flex flex-col gap-4">
            {items.map(item => (
              <article
                key={item.id}
                data-testid="cart-item"
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex gap-4 items-start"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-snug line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-primary font-bold text-lg mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2" role="group" aria-label={`Quantity for ${item.title}`}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      data-testid="qty-decrease"
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center
                        text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                        disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      −
                    </button>
                    <span
                      data-testid="qty-value"
                      className="w-8 text-center font-medium text-gray-900 dark:text-gray-100 text-sm"
                      aria-live="polite"
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      data-testid="qty-increase"
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center
                        text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.title} from cart`}
                    data-testid="remove-item"
                    className="text-xs text-red-500 hover:text-red-700 transition focus:outline-none focus:underline"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Order summary */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>

              {/* Discount code */}
              <div className="mb-4">
                {discountCode ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2">
                    <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                      Code: {discountCode}
                    </span>
                    <button
                      onClick={removeDiscount}
                      className="text-xs text-red-500 hover:text-red-700 transition"
                      aria-label="Remove discount code"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codeInput}
                      onChange={e => { setCodeInput(e.target.value); setCodeError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleApplyDiscount()}
                      placeholder="Discount code"
                      data-testid="discount-input"
                      className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600
                        bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                    <button
                      onClick={handleApplyDiscount}
                      data-testid="apply-discount"
                      className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200
                        rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {codeError && (
                  <p className="text-xs text-red-500 mt-1" role="alert">{codeError}</p>
                )}
                {codeSuccess && (
                  <p className="text-xs text-green-600 mt-1" role="status">{codeSuccess}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">Try: SAVE10, SAVE20, WELCOME</p>
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span data-testid="subtotal">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount</span>
                    <span data-testid="discount-amount">−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                  <span>Total</span>
                  <span data-testid="cart-total">{formatPrice(total)}</span>
                </div>
              </div>

              <a
                href="#/checkout"
                data-testid="proceed-to-checkout"
                className="mt-6 block w-full text-center px-6 py-3 bg-primary text-white rounded-xl font-semibold
                  hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Proceed to Checkout →
              </a>

              <a
                href="#/products"
                className="mt-3 block text-center text-sm text-primary hover:underline transition"
              >
                ← Continue Shopping
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
