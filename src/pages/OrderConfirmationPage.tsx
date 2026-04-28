import { useCart } from '../context/useCart';
import { countryLabel } from '../api/countries';

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function OrderConfirmationPage() {
  const { lastOrder, setLastOrder } = useCart();

  if (!lastOrder) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">No order found</h1>
        <a href="#/products" className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition">
          Browse Products
        </a>
      </div>
    );
  }

  const { confirmationNumber, estimatedDelivery, items, shippingAddress, subtotal, discount, total } = lastOrder;

  function handleContinue() {
    setLastOrder(null);
    window.location.hash = '#/products';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Success banner */}
        <div
          data-testid="order-confirmation"
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 mb-6 text-center"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Order Placed!</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Thank you for your purchase. We'll send a confirmation email shortly.
          </p>
          <div className="inline-block bg-gray-50 dark:bg-gray-700 rounded-xl px-6 py-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Confirmation number</p>
            <p
              data-testid="confirmation-number"
              className="text-xl font-bold text-primary tracking-wider mt-0.5"
            >
              {confirmationNumber}
            </p>
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 mb-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Estimated Delivery</p>
            <p
              data-testid="estimated-delivery"
              className="font-semibold text-gray-900 dark:text-gray-100"
            >
              {estimatedDelivery}
            </p>
          </div>
        </div>

        {/* Items ordered */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 mb-4">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
            Items Ordered ({items.length})
          </h2>
          <ul className="space-y-3">
            {items.map(item => (
              <li key={item.id} className="flex gap-3 items-center text-sm">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-1.5 text-sm border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base border-t border-gray-100 dark:border-gray-700 pt-2 mt-1">
              <span>Total Charged</span>
              <span data-testid="order-total">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 mb-8">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Shipping Address</h2>
          <address className="not-italic text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {shippingAddress.firstName} {shippingAddress.lastName}<br />
            {shippingAddress.email}<br />
            {shippingAddress.address}<br />
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
            {countryLabel(shippingAddress.countryCode)}
          </address>
        </div>

        <button
          onClick={handleContinue}
          data-testid="continue-shopping"
          className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold
            hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
