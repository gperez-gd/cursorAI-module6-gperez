import { api } from './client';

/** Order detail as returned by GET /orders/:id */
export interface OrderDetail {
  orderId: string;
  confirmationNumber: string;
  status: string;
  items: Array<{
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
  shippingAddress: Record<string, unknown>;
  paymentMethod: Record<string, unknown>;
  subtotal: number;
  discount: number;
  total: number;
  estimatedDelivery: string | null;
  createdAt: string | null;
}

export const ordersApi = {
  get(orderId: string): Promise<OrderDetail> {
    return api.get<OrderDetail>(`/orders/${orderId}`).then(r => r.data);
  },
};
