import { useState } from 'react';
import ProductCard from '../components/product/ProductCard';
import type { ProductCardProps } from '../types/product';

const PRODUCTS: ProductCardProps[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    title: 'Premium Minimalist Watch',
    description: 'A sleek timepiece crafted with Swiss precision. Features sapphire crystal glass and a stainless steel case with water resistance up to 50m.',
    price: 249.99,
    rating: 4.7,
    reviewCount: 2341,
    badge: 'Best Seller',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop',
    title: 'Wireless Noise-Cancelling Headphones',
    description: 'Immersive 40-hour battery life with adaptive ANC technology. Premium drivers deliver studio-quality sound with deep bass and crystal-clear highs.',
    price: 379.00,
    rating: 4.5,
    reviewCount: 5892,
    badge: 'New',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop',
    title: 'Trail Running Shoes',
    description: 'Engineered for the toughest terrain. Breathable mesh upper with grippy rubber outsole for ultimate traction on wet and dry surfaces.',
    price: 129.95,
    rating: 4.3,
    reviewCount: 1204,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop',
    title: 'Instant Film Camera',
    description: 'Capture memories instantly with this retro-inspired camera. Includes built-in flash, selfie mirror, and landscape/portrait lens selection.',
    price: 89.99,
    rating: 4.1,
    reviewCount: 876,
    badge: 'Sale',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop',
    title: 'Ergonomic Laptop Stand',
    description: 'Adjustable aluminum stand that elevates your laptop to eye level. Foldable design for portability with non-slip pads to protect your desk.',
    price: 59.99,
    rating: 4.8,
    reviewCount: 3107,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop',
    title: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with tactile Cherry MX switches. N-key rollover and programmable macros for competitive gaming performance.',
    price: 149.00,
    rating: 4.6,
    reviewCount: 4523,
  },
];

export default function ProductDemo() {
  const [cartItems, setCartItems] = useState<string[]>([]);

  function handleAddToCart(id: string) {
    setCartItems(prev => [...prev, id]);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Featured Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Discover our curated collection of premium products, crafted for quality and designed to impress.
          </p>
          {cartItems.length > 0 && (
            <div
              className="inline-flex items-center gap-2 mt-4 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
              role="status"
              aria-live="polite"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
            </div>
          )}
        </header>

        <section aria-label="Product grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map(product => (
              <ProductCard key={product.id} {...product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
