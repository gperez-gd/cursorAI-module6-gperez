import { api } from './client';

const CSRF_KEY = 'auth_csrf';

function csrfHeader(): Record<string, string> {
  const csrf = localStorage.getItem(CSRF_KEY);
  return csrf ? { 'X-CSRF-Token': csrf } : {};
}

export interface ApiCartLine {
  id: string;
  productId: string;
  name: string | null;
  price: number;
  quantity: number;
  lineTotal: number;
  imageUrl: string | null;
}

export interface ApiCart {
  id: string;
  items: ApiCartLine[];
  subtotal: number;
  discount: number;
  total: number;
  discountCode: string | null;
}

export const cartApi = {
  get(): Promise<ApiCart> {
    return api.get<ApiCart>('/cart').then(r => r.data);
  },

  addItem(productId: string, quantity: number): Promise<ApiCart> {
    return api
      .post<ApiCart>('/cart/items', { productId, quantity }, { headers: csrfHeader() })
      .then(r => r.data);
  },

  updateLine(cartItemId: string, quantity: number): Promise<ApiCart> {
    return api
      .put<ApiCart>(`/cart/items/${cartItemId}`, { quantity }, { headers: csrfHeader() })
      .then(r => r.data);
  },

  removeLine(cartItemId: string): Promise<ApiCart> {
    return api
      .delete<ApiCart>(`/cart/items/${cartItemId}`, { headers: csrfHeader() })
      .then(r => r.data);
  },

  applyDiscount(code: string): Promise<ApiCart> {
    return api
      .post<ApiCart>('/cart/discount', { code }, { headers: csrfHeader() })
      .then(r => r.data);
  },

  removeDiscount(): Promise<ApiCart> {
    return api.delete<ApiCart>('/cart/discount', { headers: csrfHeader() }).then(r => r.data);
  },
};
