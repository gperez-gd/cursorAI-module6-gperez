import {
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { CartItem, PlacedOrder } from './cartContext';
import { CartContext } from './cartContext';

const CART_KEY = 'cart_items';
const DEMO_DISCOUNT_CODES: Record<string, number> = {
  SAVE10: 0.10,
  SAVE20: 0.20,
  WELCOME: 0.15,
};

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [discountCode, setDiscountCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discountRate;
  const total = subtotal - discountAmount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const persist = useCallback((updated: CartItem[]) => {
    setItems(updated);
    saveCart(updated);
  }, []);

  const addItem = useCallback((product: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      const updated = existing
        ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...product, quantity: 1 }];
      saveCart(updated);
      return updated;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      saveCart(updated);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, quantity } : i);
      saveCart(updated);
      return updated;
    });
  }, []);

  const applyDiscount = useCallback((code: string): boolean => {
    const rate = DEMO_DISCOUNT_CODES[code.toUpperCase()];
    if (rate !== undefined) {
      setDiscountCode(code.toUpperCase());
      setDiscountRate(rate);
      return true;
    }
    return false;
  }, []);

  const removeDiscount = useCallback(() => {
    setDiscountCode('');
    setDiscountRate(0);
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
    setDiscountCode('');
    setDiscountRate(0);
  }, [persist]);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      discountCode,
      discountAmount,
      total,
      lastOrder,
      addItem,
      removeItem,
      updateQuantity,
      applyDiscount,
      removeDiscount,
      clearCart,
      setLastOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
}
