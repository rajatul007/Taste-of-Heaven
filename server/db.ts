import { Restaurant, MenuItem, Coupon, User, Order, SearchSuggestion, TableBooking } from '../src/types';
import { SEED_RESTAURANTS, SEED_MENU_ITEMS, SEED_COUPONS, SEED_USERS } from './data/seedData';

class DatabaseStore {
  private restaurants: Restaurant[] = [...SEED_RESTAURANTS];
  private menuItems: MenuItem[] = [...SEED_MENU_ITEMS];
  private coupons: Coupon[] = [...SEED_COUPONS];
  private users: User[] = [...SEED_USERS];
  private orders: Order[] = [];
  private tableBookings: TableBooking[] = [];

  constructor() {
    this.initSampleOrders();
    this.initSampleBookings();
  }

  private initSampleBookings() {
    this.tableBookings = [
      {
        id: 'book-101',
        bookingCode: 'TH-TB-9821',
        restaurantId: 'resto-bbq-nation',
        restaurantName: 'Barbeque Nation',
        restaurantAddress: '2nd Floor, Omaxe Connaught Place Mall, Beta 2, Greater Noida',
        customerName: 'Aarav Sharma',
        customerPhone: '+91 98112 34567',
        guestsCount: 4,
        bookingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        timeSlot: '08:00 PM',
        status: 'confirmed',
        discountOffer: 'FLAT 25% OFF on Live Grill Buffet + Free Mocktail',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'book-102',
        bookingCode: 'TH-TB-4412',
        restaurantId: 'resto-appitito',
        restaurantName: 'Appitito',
        restaurantAddress: 'UP 16 KP 2, Institutional Hub, Knowledge Park 2, Greater Noida',
        customerName: 'Priya Verma',
        customerPhone: '+91 98111 22334',
        guestsCount: 2,
        bookingDate: new Date().toISOString().split('T')[0],
        timeSlot: '07:30 PM',
        status: 'confirmed',
        discountOffer: 'FLAT 20% OFF on Total Dine-in Bill',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  }

  private initSampleOrders() {
    this.orders = [
      {
        id: 'ord-101',
        orderNumber: 'FR-98214',
        userId: 'user-customer-1',
        customerName: 'Aarav Sharma',
        customerPhone: '+91 98112 34567',
        restaurantId: 'resto-appitito',
        restaurantName: 'Appitito',
        restaurantAddress: 'UP 16 KP 2, Institutional Hub, Knowledge Park 2, Greater Noida',
        restaurantPhone: '+91 98182 34516',
        items: [
          {
            cartItemId: 'dish-app-1_thin',
            menuItem: this.menuItems.find((m) => m.id === 'dish-app-1') || this.menuItems[0],
            quantity: 1,
            selectedOptions: [{ groupId: 'crust', groupName: 'Crust', optionId: 'thin', optionName: 'Neapolitan Thin Crust', price: 0 }],
            itemTotal: 299,
          },
          {
            cartItemId: 'dish-app-2',
            menuItem: this.menuItems.find((m) => m.id === 'dish-app-2') || this.menuItems[1],
            quantity: 1,
            selectedOptions: [],
            itemTotal: 149,
          },
        ],
        subtotal: 448,
        deliveryFee: 29,
        tax: 22,
        discount: 100,
        tip: 20,
        total: 419,
        couponCode: 'RUSH50',
        deliveryAddress: {
          id: 'addr-1',
          label: 'Home',
          street: 'Flat 402, Tower B, Eldeco Green Meadows',
          locality: 'Sector Alpha 1',
          city: 'Greater Noida',
          state: 'Uttar Pradesh',
          pincode: '201310',
          landmark: 'Near Alpha 1 Commercial Market',
        },
        deliveryInstructions: 'Leave with security guard',
        deliveryOtp: '4892',
        paymentMethod: 'upi',
        paymentStatus: 'completed',
        paymentTransactionId: 'pay_rzp_live_test_7781',
        orderStatus: 'out_for_delivery',
        statusHistory: [
          { status: 'pending', timestamp: new Date(Date.now() - 35 * 60000).toISOString(), note: 'Order placed & payment verified' },
          { status: 'confirmed', timestamp: new Date(Date.now() - 32 * 60000).toISOString(), note: 'Kitchen accepted order' },
          { status: 'preparing', timestamp: new Date(Date.now() - 25 * 60000).toISOString(), note: 'Chef is baking your wood-fired pizza' },
          { status: 'driver_assigned', timestamp: new Date(Date.now() - 18 * 60000).toISOString(), note: 'Delivery partner Ramesh Kumar assigned (4.9 ★)' },
          { status: 'at_restaurant', timestamp: new Date(Date.now() - 12 * 60000).toISOString(), note: 'Rider reached restaurant and waiting for parcel' },
          { status: 'ready_for_pickup', timestamp: new Date(Date.now() - 10 * 60000).toISOString(), note: 'Order packed in sealed thermal bag' },
          { status: 'out_for_delivery', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), note: 'Ramesh is out for delivery with your hot food' },
        ],
        riderInfo: {
          name: 'Ramesh Kumar',
          phone: '+91 98711 00223',
          vehicleNumber: 'UP 16 BR 4092',
          vehicleModel: 'Ather 450X (Electric)',
          rating: 4.9,
          tripsCount: 1420,
          currentEtaMins: 12,
          latitude: 28.4744,
          longitude: 77.5040,
        },
        createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
        estimatedDeliveryTime: 'In ~12 - 15 mins',
      },
    ];
  }

  // --- RESTAURANT QUERIES ---
  getRestaurants(filters?: {
    region?: string;
    locality?: string;
    cuisine?: string;
    isVeg?: boolean;
    rating?: number;
    search?: string;
    sort?: string;
  }): Restaurant[] {
    let result = [...this.restaurants];

    if (filters?.region && filters.region !== 'all') {
      result = result.filter((r) => r.region.toLowerCase() === filters.region!.toLowerCase());
    }

    if (filters?.locality && filters.locality !== 'all') {
      const loc = filters.locality.toLowerCase().trim();
      const directMatches = result.filter(
        (r) =>
          r.locality.toLowerCase().includes(loc) ||
          r.address.toLowerCase().includes(loc) ||
          (loc.includes('alpha 1') && r.locality.toLowerCase().includes('alpha 1')) ||
          (loc.includes('alpha 2') && r.locality.toLowerCase().includes('alpha 2')) ||
          (loc.includes('beta 2') && r.locality.toLowerCase().includes('beta 2')) ||
          (loc.includes('beta 1') && r.locality.toLowerCase().includes('beta 1')) ||
          (loc.includes('knowledge park 2') && r.locality.toLowerCase().includes('knowledge park 2')) ||
          (loc.includes('knowledge park') && r.locality.toLowerCase().includes('knowledge park'))
      );

      // If direct matches exist, show them first, followed by other nearby restaurants in the same region
      if (directMatches.length > 0) {
        const otherRestos = result.filter((r) => !directMatches.includes(r));
        result = [...directMatches, ...otherRestos];
      }
    }

    if (filters?.isVeg) {
      const vegMatches = result.filter((r) => r.isPureVeg);
      if (vegMatches.length > 0) {
        result = vegMatches;
      }
    }

    if (filters?.rating) {
      const ratedMatches = result.filter((r) => r.rating >= filters.rating!);
      if (ratedMatches.length > 0) {
        result = ratedMatches;
      }
    }

    if (filters?.cuisine && filters.cuisine !== 'all') {
      const rawC = filters.cuisine.toLowerCase();

      // Intelligent cuisine keywords dictionary
      const keywords: string[] = [rawC];
      if (rawC.includes('chole') || rawC.includes('bhature')) {
        keywords.push('north indian', 'street food', 'sweets & chaat', 'thalis', 'pure veg');
      } else if (rawC.includes('pizza') || rawC.includes('wood-fired')) {
        keywords.push('pizza', 'italian', 'continental', 'cafe & shakes');
      } else if (rawC.includes('burger') || rawC.includes('flame') || rawC.includes('whopper')) {
        keywords.push('burgers', 'american', 'fast food');
      } else if (rawC.includes('mughlai') || rawC.includes('biryani')) {
        keywords.push('mughlai', 'biryani', 'north indian', 'kebabs', 'tandoori');
      } else if (rawC.includes('grill') || rawC.includes('bbq') || rawC.includes('buffet') || rawC.includes('barbecue')) {
        keywords.push('barbecue', 'bbq', 'kebabs', 'buffet', 'north indian');
      } else if (rawC.includes('paratha')) {
        keywords.push('north indian', 'student bites', 'street food', 'punjabi');
      } else if (rawC.includes('fudge') || rawC.includes('ice cream') || rawC.includes('dessert') || rawC.includes('waffle')) {
        keywords.push('ice cream', 'desserts', 'waffles', 'cafe & shakes', 'bakery');
      } else if (rawC.includes('dosa') || rawC.includes('south indian') || rawC.includes('idli')) {
        keywords.push('south indian', 'pure veg', 'breakfast');
      } else if (rawC.includes('momo') || rawC.includes('chinese') || rawC.includes('noodles')) {
        keywords.push('momos', 'chinese', 'pan asian', 'tibetan', 'fast food');
      } else if (rawC.includes('roll') || rawC.includes('wrap')) {
        keywords.push('rolls', 'wraps', 'fast food', 'kolkata street food');
      }

      const cuisineMatches = result.filter((r) =>
        r.cuisine.some((item) => keywords.some((k) => item.toLowerCase().includes(k))) ||
        r.categories.some((cat) => keywords.some((k) => cat.toLowerCase().includes(k))) ||
        keywords.some((k) => r.description.toLowerCase().includes(k)) ||
        keywords.some((k) => r.name.toLowerCase().includes(k))
      );

      if (cuisineMatches.length > 0) {
        result = cuisineMatches;
      }
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      const searchMatches = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.locality.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
          r.categories.some((cat) => cat.toLowerCase().includes(q))
      );
      if (searchMatches.length > 0) {
        result = searchMatches;
      }
    }

    // Sort
    if (filters?.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters?.sort === 'deliveryTime') {
      result.sort((a, b) => a.deliveryTimeMins - b.deliveryTimeMins);
    } else if (filters?.sort === 'costAsc') {
      result.sort((a, b) => a.costForTwo - b.costForTwo);
    } else if (filters?.sort === 'costDesc') {
      result.sort((a, b) => b.costForTwo - a.costForTwo);
    }

    // If completely empty, fallback to all restaurants in region or all restaurants
    if (result.length === 0) {
      result = filters?.region && filters.region !== 'all'
        ? this.restaurants.filter((r) => r.region.toLowerCase() === filters.region!.toLowerCase())
        : [...this.restaurants];
    }

    return result;
  }

  getRestaurantByIdOrSlug(idOrSlug: string): Restaurant | undefined {
    return this.restaurants.find(
      (r) => r.id === idOrSlug || r.slug.toLowerCase() === idOrSlug.toLowerCase()
    );
  }

  updateRestaurant(id: string, updates: Partial<Restaurant>): Restaurant | undefined {
    const idx = this.restaurants.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    this.restaurants[idx] = { ...this.restaurants[idx], ...updates };
    return this.restaurants[idx];
  }

  // --- MENU ITEMS ---
  getMenuItemsByRestaurant(restaurantId: string): MenuItem[] {
    return this.menuItems.filter((item) => item.restaurantId === restaurantId);
  }

  getAllMenuItems(): MenuItem[] {
    return this.menuItems;
  }

  getMenuItemById(id: string): MenuItem | undefined {
    return this.menuItems.find((item) => item.id === id);
  }

  updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | undefined {
    const idx = this.menuItems.findIndex((item) => item.id === id);
    if (idx === -1) return undefined;
    this.menuItems[idx] = { ...this.menuItems[idx], ...updates };
    return this.menuItems[idx];
  }

  addMenuItem(item: MenuItem): MenuItem {
    this.menuItems.push(item);
    return item;
  }

  // --- SWIGGY-STYLE SEARCH SUGGESTIONS ---
  getSearchSuggestions(query: string): SearchSuggestion[] {
    if (!query || query.trim().length === 0) return [];
    const q = query.trim().toLowerCase();
    const suggestions: SearchSuggestion[] = [];

    // 1. Matches dishes
    const matchedDishes = this.menuItems
      .filter((d) => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q))
      .slice(0, 4);

    matchedDishes.forEach((d) => {
      const resto = this.restaurants.find((r) => r.id === d.restaurantId);
      suggestions.push({
        type: 'dish',
        id: d.id,
        title: d.name,
        subtitle: `${resto ? resto.name : 'Restaurant'} • ₹${d.price}`,
        image: d.image,
        isVeg: d.isVeg,
        price: d.price,
        restaurantId: d.restaurantId,
        restaurantName: resto?.name,
        slug: resto?.slug,
        dish: d,
      });
    });

    // 2. Matches restaurants
    const matchedRestos = this.restaurants
      .filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q))
      )
      .slice(0, 4);

    matchedRestos.forEach((r) => {
      suggestions.push({
        type: 'restaurant',
        id: r.id,
        title: r.name,
        subtitle: `${r.cuisine.slice(0, 2).join(', ')} • ${r.locality}, ${r.city}`,
        image: r.coverImage,
        rating: r.rating,
        deliveryTimeMins: r.deliveryTimeMins,
        slug: r.slug,
      });
    });

    // 3. Matches localities
    const localities = [
      { name: 'Knowledge Park 2', city: 'Greater Noida', desc: 'Appitito Cafe, Institutional Area' },
      { name: 'Beta 2', city: 'Greater Noida', desc: 'Barbeque Nation & Burger King @ Omaxe Mall' },
      { name: 'Alpha 1', city: 'Greater Noida', desc: 'Nirula’s & Commercial Complex' },
      { name: 'Alpha 2', city: 'Greater Noida', desc: 'Banzara Bliss, MSX Market' },
      { name: 'Knowledge Park III', city: 'Greater Noida', desc: 'Paratha Gali, Sharda & Galgotias' },
      { name: 'Pari Chowk', city: 'Greater Noida', desc: 'Bikanervala, The Yellow Chilli' },
      { name: 'Sector 18', city: 'Noida', desc: "Karim's Historic Old Delhi, Atta Market" },
      { name: 'Sector 132', city: 'Noida', desc: 'Carnatic Cafe, Expressway' },
      { name: 'Connaught Place', city: 'Delhi', desc: 'Moti Mahal Delux, Central Delhi' },
      { name: 'DLF Cyber Hub', city: 'Gurugram', desc: 'Cyber Hub Social, DLF Phase 2' },
    ];

    const matchedLocalities = localities
      .filter((l) => l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q))
      .slice(0, 3);

    matchedLocalities.forEach((l) => {
      suggestions.push({
        type: 'locality',
        id: `loc-${l.name.toLowerCase().replace(/\s+/g, '-')}`,
        title: `${l.name}, ${l.city}`,
        subtitle: l.desc,
      });
    });

    return suggestions;
  }

  // --- COUPONS ---
  getCoupons(): Coupon[] {
    return this.coupons;
  }

  validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
    const coupon = this.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code. Try RUSH50 or WELCOME100.' };
    }

    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Add items worth ₹${coupon.minOrderAmount - subtotal} more to use ${coupon.code}`,
      };
    }

    let discount = 0;
    if (coupon.discountAmount) {
      discount = coupon.discountAmount;
    } else if (coupon.discountPercentage) {
      discount = Math.round((subtotal * coupon.discountPercentage) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }

    return {
      valid: true,
      discount,
      message: `Coupon ${coupon.code} applied successfully! You saved ₹${discount}`,
      coupon,
    };
  }

  // --- ORDERS ---
  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'statusHistory'>): Order {
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `TH-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      deliveryOtp: randomOtp,
      statusHistory: [
        {
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          note: 'Order confirmed and acknowledged by kitchen.',
        },
      ],
      riderInfo: {
        name: 'Ramesh Kumar',
        phone: '+91 98711 00223',
        vehicleNumber: 'UP 16 BR 4092',
        vehicleModel: 'Ather 450X (Electric)',
        rating: 4.9,
        tripsCount: 1420,
        currentEtaMins: 15,
        latitude: 28.4744,
        longitude: 77.5040,
      },
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  getUserOrders(userId: string): Order[] {
    return this.orders.filter((o) => o.userId === userId);
  }

  getRestaurantOrders(restaurantId: string): Order[] {
    return this.orders.filter((o) => o.restaurantId === restaurantId);
  }

  getAllOrders(): Order[] {
    return this.orders;
  }

  updateOrderStatus(orderId: string, status: Order['orderStatus'], note?: string): Order | undefined {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return undefined;

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${status.replace('_', ' ')}`,
    });

    return order;
  }

  // --- USERS & AUTH ---
  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData: Omit<User, 'id' | 'savedAddresses' | 'favoriteRestaurantIds'>): User {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          label: 'Home',
          street: 'Alpha 1 Residential Pocket',
          locality: 'Sector Alpha 1',
          city: 'Greater Noida',
          state: 'Uttar Pradesh',
          pincode: '201310',
          isDefault: true,
        },
      ],
      favoriteRestaurantIds: [],
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.users[idx] = { ...this.users[idx], ...updates };
    return this.users[idx];
  }

  // --- DINEOUT TABLE BOOKINGS ---
  createTableBooking(bookingData: Omit<TableBooking, 'id' | 'bookingCode' | 'createdAt' | 'status'>): TableBooking {
    const randomCode = `TH-TB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: TableBooking = {
      ...bookingData,
      id: `tb-${Date.now()}`,
      bookingCode: randomCode,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    this.tableBookings.unshift(newBooking);
    return newBooking;
  }

  getTableBookings(restaurantId?: string, customerPhone?: string): TableBooking[] {
    let result = [...this.tableBookings];
    if (restaurantId) {
      result = result.filter((b) => b.restaurantId === restaurantId);
    }
    if (customerPhone) {
      result = result.filter((b) => b.customerPhone.includes(customerPhone));
    }
    return result;
  }

  getTableBookingById(id: string): TableBooking | undefined {
    return this.tableBookings.find((b) => b.id === id || b.bookingCode === id);
  }
}

export const db = new DatabaseStore();
