import { Restaurant, MenuItem, Order, Coupon, SearchSuggestion, User, TableBooking } from '../types';

export const api = {
  // --- RESTAURANTS ---
  async getRestaurants(params?: {
    region?: string;
    locality?: string;
    cuisine?: string;
    isVeg?: boolean;
    rating?: number;
    search?: string;
    sort?: string;
  }): Promise<Restaurant[]> {
    const query = new URLSearchParams();
    if (params?.region) query.set('region', params.region);
    if (params?.locality) query.set('locality', params.locality);
    if (params?.cuisine) query.set('cuisine', params.cuisine);
    if (params?.isVeg) query.set('isVeg', 'true');
    if (params?.rating) query.set('rating', params.rating.toString());
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);

    const res = await fetch(`/api/restaurants?${query.toString()}`);
    const json = await res.json();
    return json.data || [];
  },

  async getRestaurantByIdOrSlug(idOrSlug: string): Promise<{ restaurant: Restaurant; menuItems: MenuItem[] }> {
    const res = await fetch(`/api/restaurants/${idOrSlug}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Restaurant not found');
    return json.data;
  },

  // --- SEARCH SUGGESTIONS ---
  async getSearchSuggestions(q: string): Promise<SearchSuggestion[]> {
    if (!q || !q.trim()) return [];
    const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
    const json = await res.json();
    return json.data || [];
  },

  // --- CART VALIDATION ---
  async validateCart(payload: {
    items: any[];
    restaurantId: string;
    couponCode?: string;
    tip?: number;
  }) {
    const res = await fetch('/api/cart/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  // --- ORDERS ---
  async createOrder(orderPayload: any): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const res = await fetch(`/api/orders/user/${userId}`);
    const json = await res.json();
    return json.data || [];
  },

  async updateOrderStatus(id: string, status: string, note?: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  // --- COUPONS ---
  async getCoupons(): Promise<Coupon[]> {
    const res = await fetch('/api/coupons');
    const json = await res.json();
    return json.data || [];
  },

  async applyCoupon(code: string, subtotal: number) {
    const res = await fetch('/api/coupons/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });
    return await res.json();
  },

  // --- AUTH ---
  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async register(payload: { name: string; email: string; phone?: string; role?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  // --- RESTAURANT OWNER ---
  async getOwnerOrders(restaurantId: string): Promise<Order[]> {
    const res = await fetch(`/api/owner/orders/${restaurantId}`);
    const json = await res.json();
    return json.data || [];
  },

  async updateDishStock(dishId: string, isAvailable: boolean, price?: number): Promise<MenuItem> {
    const res = await fetch(`/api/owner/menu/${dishId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable, price }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  // --- ADMIN ---
  async getAdminMetrics() {
    const res = await fetch('/api/admin/metrics');
    const json = await res.json();
    return json.data;
  },

  async updateRestaurantAdmin(id: string, updates: Partial<Restaurant>) {
    const res = await fetch(`/api/admin/restaurants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  // --- DINEOUT ---
  async bookTable(payload: {
    restaurantId: string;
    customerName: string;
    customerPhone: string;
    guestsCount: number;
    bookingDate: string;
    timeSlot: string;
    discountOffer?: string;
  }): Promise<TableBooking> {
    const res = await fetch('/api/dineout/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to book table');
    return json.data;
  },

  async getTableBookings(params?: { restaurantId?: string; phone?: string }): Promise<TableBooking[]> {
    const query = new URLSearchParams();
    if (params?.restaurantId) query.set('restaurantId', params.restaurantId);
    if (params?.phone) query.set('phone', params.phone);
    const res = await fetch(`/api/dineout/bookings?${query.toString()}`);
    const json = await res.json();
    return json.data || [];
  },
};
