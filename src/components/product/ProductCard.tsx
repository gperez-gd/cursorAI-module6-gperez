import { useState } from 'react';
import type { ProductCardProps } from '../../types/product';
import RatingStars from './RatingStars';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

export default function ProductCard({
  id,
  image,
  title,
  description,
  price,
  rating,
  reviewCount,
  badge,
  onAddToCart,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    onAddToCart?.(id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl
        transition-all duration-300 overflow-hidden flex flex-col
        hover:-translate-y-1"
      aria-label={`Product: ${title}`}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-snug line-clamp-2">
          {title}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 flex-1">
          {description}
        </p>

        <div className="flex items-center gap-2">
          <RatingStars rating={rating} />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({reviewCount.toLocaleString()})
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatPrice(price)}
          </span>

          <button
            onClick={handleAddToCart}
            aria-label={`Add ${title} to cart`}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${added
                ? 'bg-green-500 text-white scale-95'
                : 'bg-primary hover:bg-primary-dark text-white hover:scale-105 active:scale-95'
              }`}
          >
            {added ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Added!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
