import { useState, useMemo } from 'react';
import ProductCard from '../components/product/ProductCard';
import type { ProductCardProps } from '../types/product';
import { useCart } from '../context/useCart';

interface Product extends ProductCardProps {
  category: string;
}

const ALL_PRODUCTS: Product[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    title: 'Premium Minimalist Watch',
    description: 'A sleek timepiece crafted with Swiss precision. Features sapphire crystal glass and a stainless steel case with water resistance up to 50m.',
    price: 249.99,
    rating: 4.7,
    reviewCount: 2341,
    badge: 'Best Seller',
    category: 'Accessories',
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
    category: 'Electronics',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop',
    title: 'Trail Running Shoes',
    description: 'Engineered for the toughest terrain. Breathable mesh upper with grippy rubber outsole for ultimate traction on wet and dry surfaces.',
    price: 129.95,
    rating: 4.3,
    reviewCount: 1204,
    category: 'Footwear',
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
    category: 'Electronics',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop',
    title: 'Ergonomic Laptop Stand',
    description: 'Adjustable aluminum stand that elevates your laptop to eye level. Foldable design for portability with non-slip pads to protect your desk.',
    price: 59.99,
    rating: 4.8,
    reviewCount: 3107,
    category: 'Office',
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop',
    title: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with tactile Cherry MX switches. N-key rollover and programmable macros for competitive gaming performance.',
    price: 149.00,
    rating: 4.6,
    reviewCount: 4523,
    category: 'Electronics',
  },
];

const CATEGORIES = ['All', 'Accessories', 'Electronics', 'Footwear', 'Office'] as const;

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name-asc' | 'name-desc';
type PriceRange = 'all' | 'under-100' | '100-200' | 'over-200';

const PAGE_SIZE = 3;

function matchesPriceRange(price: number, range: PriceRange): boolean {
  if (range === 'under-100') return price < 100;
  if (range === '100-200') return price >= 100 && price <= 200;
  if (range === 'over-200') return price > 200;
  return true;
}

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
    case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
    case 'name-asc': return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc': return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default: return sorted; // 'featured' keeps original order
  }
}

interface ProductDemoProps {
  navSearchQuery?: string;
}

export default function ProductDemo({ navSearchQuery = '' }: ProductDemoProps) {
  const { addItem, itemCount } = useCart();
  const [search, setSearch] = useState(navSearchQuery);
  const [category, setCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [sort, setSort] = useState<SortKey>('featured');
  const [page, setPage] = useState(1);
  const [lastSyncedNavSearch, setLastSyncedNavSearch] = useState(navSearchQuery);

  if (lastSyncedNavSearch !== navSearchQuery) {
    setLastSyncedNavSearch(navSearchQuery);
    setSearch(navSearchQuery);
    setPage(1);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = ALL_PRODUCTS.filter(p => {
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesCategory = category === 'All' || p.category === category;
      const matchesPrice = matchesPriceRange(p.price, priceRange);
      return matchesSearch && matchesCategory && matchesPrice;
    });
    return sortProducts(result, sort);
  }, [search, category, priceRange, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageProducts = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleFilterChange(fn: () => void) {
    fn();
    setPage(1);
  }

  function clearFilters() {
    setSearch('');
    setCategory('All');
    setPriceRange('all');
    setSort('featured');
    setPage(1);
  }

  function handleAddToCart(id: string) {
    const product = ALL_PRODUCTS.find(p => p.id === id);
    if (product) {
      addItem({ id: product.id, title: product.title, price: product.price, image: product.image });
    }
  }

  const hasActiveFilters = search.trim() !== '' || category !== 'All' || priceRange !== 'all';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Featured Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Discover our curated collection of premium products, crafted for quality and designed to impress.
          </p>
          {itemCount > 0 && (
            <a
              href="#/cart"
              data-testid="cart-summary-link"
              className="inline-flex items-center gap-2 mt-4 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium
                hover:bg-primary/20 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`View cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount} item{itemCount !== 1 ? 's' : ''} in cart — View Cart →
            </a>
          )}
        </header>

        {/* Search & Filters */}
        <section
          aria-label="Search and filter products"
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-8 flex flex-col gap-4"
        >
          {/* Search */}
          <div className="relative">
            <label htmlFor="product-search" className="sr-only">Search products</label>
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              id="product-search"
              type="search"
              data-testid="search-input"
              placeholder="Search…"
              value={search}
              onChange={e => handleFilterChange(() => setSearch(e.target.value))}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap gap-3 items-end">
            {/* Category */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label htmlFor="category-filter" className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Category
              </label>
              <select
                id="category-filter"
                data-testid="category-filter"
                value={category}
                onChange={e => handleFilterChange(() => setCategory(e.target.value))}
                className="rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2
                  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price range */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label htmlFor="price-filter" className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Price Range
              </label>
              <select
                id="price-filter"
                data-testid="price-filter"
                value={priceRange}
                onChange={e => handleFilterChange(() => setPriceRange(e.target.value as PriceRange))}
                className="rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2
                  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
              >
                <option value="all">All Prices</option>
                <option value="under-100">Under $100</option>
                <option value="100-200">$100 – $200</option>
                <option value="over-200">Over $200</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-1 min-w-[180px]">
              <label htmlFor="sort-select" className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Sort By
              </label>
              <select
                id="sort-select"
                data-testid="sort-select"
                value={sort}
                onChange={e => handleFilterChange(() => setSort(e.target.value as SortKey))}
                className="rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2
                  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                data-testid="clear-filters"
                onClick={clearFilters}
                className="ml-auto px-4 py-2 rounded-xl text-sm font-medium
                  text-primary border border-primary hover:bg-primary/10
                  transition focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Result count */}
          <p
            data-testid="result-count"
            className="text-sm text-gray-500 dark:text-gray-400"
            aria-live="polite"
          >
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </p>
        </section>

        {/* Products */}
        <section aria-label="Product grid">
          {pageProducts.length === 0 ? (
            <div
              data-testid="no-results"
              className="text-center py-20"
              role="status"
            >
              <svg className="mx-auto w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No products found</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageProducts.map(p => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  image={p.image}
                  title={p.title}
                  description={p.description}
                  price={p.price}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  badge={p.badge}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {filtered.length > 0 && totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-10 flex items-center justify-center gap-4"
          >
            <button
              data-testid="pagination-prev"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium
                text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                hover:bg-gray-50 dark:hover:bg-gray-700
                disabled:opacity-40 disabled:cursor-not-allowed
                transition focus:outline-none focus:ring-2 focus:ring-primary"
            >
              ← Previous
            </button>

            <span
              data-testid="page-info"
              className="text-sm text-gray-600 dark:text-gray-400 font-medium"
              aria-live="polite"
              aria-label={`Page ${safePage} of ${totalPages}`}
            >
              Page {safePage} of {totalPages}
            </span>

            <button
              data-testid="pagination-next"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium
                text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                hover:bg-gray-50 dark:hover:bg-gray-700
                disabled:opacity-40 disabled:cursor-not-allowed
                transition focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Next →
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
