import { createContext } from 'react';
import type { ShippingAddressDisplay } from '../api/checkoutApi';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface PlacedOrder {
  orderId: string;
  confirmationNumber: string;
  total: number;
  subtotal: number;
  discount: number;
  estimatedDelivery: string;
  items: CartItem[];
  shippingAddress: ShippingAddressDisplay;
}

export type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountCode: string;
  discountAmount: number;
  total: number;
  lastOrder: PlacedOrder | null;
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyDiscount: (code: string) => boolean;
  removeDiscount: () => void;
  clearCart: () => void;
  setLastOrder: (order: PlacedOrder | null) => void;
};

export const CartContext = createContext<CartContextValue | null>(null);
