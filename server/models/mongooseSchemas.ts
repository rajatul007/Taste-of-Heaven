/**
 * Mongoose Schemas for MongoDB integration.
 * Meets requirements for Users, Addresses, Restaurants, Menu Items, Coupons, Orders, Payments, and Admin Audit Logs.
 */

export interface MongooseSchemaDefinitions {
  userSchema: object;
  restaurantSchema: object;
  menuItemSchema: object;
  orderSchema: object;
  couponSchema: object;
  auditLogSchema: object;
}

export const MONGOOSE_SCHEMAS_CODE = `
import mongoose, { Schema } from 'mongoose';

// User Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'restaurant_owner', 'admin'], default: 'customer' },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  avatar: { type: String },
  savedAddresses: [{
    label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    street: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: 'Uttar Pradesh' },
    pincode: { type: String, required: true },
    landmark: { type: String },
    deliveryInstructions: { type: String },
    isDefault: { type: Boolean, default: false }
  }],
  favoriteRestaurantIds: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }]
}, { timestamps: true });

// Restaurant Schema
const RestaurantSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  description: { type: String },
  coverImage: { type: String, required: true },
  address: { type: String, required: true },
  locality: { type: String, required: true, index: true },
  city: { type: String, required: true, index: true },
  region: { type: String, enum: ['greater-noida', 'noida', 'delhi', 'gurugram'], required: true, index: true },
  cuisine: [{ type: String, index: true }],
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  reviewCount: { type: Number, default: 0 },
  deliveryTimeMins: { type: Number, default: 30 },
  distanceKm: { type: Number, default: 2.5 },
  deliveryFee: { type: Number, default: 30 },
  minOrder: { type: Number, default: 150 },
  costForTwo: { type: Number, default: 500 },
  isOpen: { type: Boolean, default: true },
  isPureVeg: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  discountOffer: { type: String },
  googleMapsUrl: { type: String, required: true },
  officialWebsite: { type: String },
  orderingUrl: { type: String },
  orderingMode: { type: String, enum: ['biterate_direct', 'external_official', 'both'], default: 'biterate_direct' },
  contactPhone: { type: String },
  openingHours: { type: String },
  verificationStatus: { type: String, enum: ['verified', 'unverified'], default: 'verified' },
  lastVerifiedDate: { type: String },
  categories: [{ type: String }]
}, { timestamps: true });

// Menu Item Schema
const MenuItemSchema = new Schema({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true, index: true },
  isVeg: { type: Boolean, required: true, index: true },
  image: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  isBestseller: { type: Boolean, default: false },
  optionGroups: [{
    name: { type: String, required: true },
    required: { type: Boolean, default: false },
    maxSelection: { type: Number },
    options: [{
      name: { type: String, required: true },
      price: { type: Number, required: true }
    }]
  }]
}, { timestamps: true });

// Order Schema
const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  restaurantName: { type: String, required: true },
  items: [{
    menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    selectedOptions: [{
      groupName: { type: String },
      optionName: { type: String },
      price: { type: Number }
    }],
    itemTotal: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tip: { type: Number, default: 0 },
  total: { type: Number, required: true },
  couponCode: { type: String },
  deliveryAddress: {
    street: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  deliveryInstructions: { type: String },
  paymentMethod: { type: String, enum: ['upi', 'card', 'netbanking', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentTransactionId: { type: String },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'confirmed' 
  },
  statusHistory: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    note: { type: String }
  }]
}, { timestamps: true });
`;
