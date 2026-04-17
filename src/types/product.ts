export interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
}

export interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  onAddToCart?: (id: string) => void;
}
