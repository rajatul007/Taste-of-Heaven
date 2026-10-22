export type UserRole = 'customer' | 'restaurant_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  restaurantId?: string; // If restaurant owner
  avatar?: string;
  savedAddresses: Address[];
  favoriteRestaurantIds: string[];
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
}

export interface MenuItemOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemOptionGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelection?: number;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image: string;
  isAvailable: boolean;
  rating?: number;
  reviewCount?: number;
  isBestseller?: boolean;
  optionGroups?: MenuItemOptionGroup[];
}

export type OrderingMode = 'biterate_direct' | 'external_official' | 'both';

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  address: string;
  locality: string; // e.g. "Alpha 1", "Alpha 2", "Beta 2", "Knowledge Park III", "Sector 18"
  city: string; // "Greater Noida", "Noida", "Delhi", "Gurugram"
  region: 'greater-noida' | 'noida' | 'delhi' | 'gurugram';
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTimeMins: number;
  distanceKm: number;
  deliveryFee: number;
  minOrder: number;
  costForTwo: number;
  isOpen: boolean;
  isPureVeg: boolean;
  isFeatured?: boolean;
  isPromoted?: boolean;
  discountOffer?: string; // e.g. "50% OFF UP TO ₹100"
  googleMapsUrl: string;
  officialWebsite?: string;
  orderingUrl?: string;
  orderingMode: OrderingMode;
  contactPhone: string;
  openingHours: string;
  verificationStatus: 'verified' | 'unverified';
  lastVerifiedDate: string;
  categories: string[];
  dineInReservationAvailable?: boolean;
  takeawayAvailable?: boolean;
  homeDeliveryAvailable: boolean;
  hasDineout?: boolean;
  dineoutDiscount?: string; // e.g. "FLAT 25% OFF with Dineout"
  tableBookingAvailable?: boolean;
}

export interface TableBooking {
  id: string;
  bookingCode: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName: string;
  customerPhone: string;
  guestsCount: number;
  bookingDate: string;
  timeSlot: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  discountOffer: string;
  createdAt: string;
}

export interface SelectedOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // item id + chosen options hash
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  itemTotal: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountPercentage?: number;
  discountAmount?: number;
  maxDiscount?: number;
  minOrderAmount: number;
  validUntil: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'driver_assigned'
  | 'at_restaurant'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'arrived'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
  couponCode?: string;
  deliveryAddress: Address;
  deliveryInstructions?: string;
  deliveryOtp?: string;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentTransactionId?: string;
  orderStatus: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  riderInfo?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    vehicleModel?: string;
    photo?: string;
    rating?: number;
    tripsCount?: number;
    currentEtaMins?: number;
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  estimatedDeliveryTime: string;
}

export interface SearchSuggestion {
  type: 'dish' | 'restaurant' | 'locality';
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  isVeg?: boolean;
  price?: number;
  restaurantId?: string;
  restaurantName?: string;
  rating?: number;
  deliveryTimeMins?: number;
  slug?: string;
  dish?: MenuItem;
}

export interface LocationState {
  locality: string;
  city: string;
  addressString: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isUsingGPS: boolean;
}
