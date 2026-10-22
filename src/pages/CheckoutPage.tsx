import React, { useState } from 'react';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Lock,
  Plus,
  AlertCircle,
  QrCode,
  Smartphone,
  Banknote,
  Building,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { Address } from '../types';
import { api } from '../services/api';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onOrderSuccess }) => {
  const { items, restaurant, subtotal, deliveryFee, tax, discount, tip, setTip, grandTotal, coupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { location } = useLocation();

  // Selected address state
  const [selectedAddress, setSelectedAddress] = useState<Address>(() => {
    if (user?.savedAddresses && user.savedAddresses.length > 0) {
      return user.savedAddresses[0];
    }
    return {
      id: 'addr-default',
      label: 'Home',
      street: 'Flat 402, Tower B, Eldeco Green Meadows',
      locality: location.locality,
      city: location.city,
      state: 'Uttar Pradesh',
      pincode: '201310',
      landmark: 'Near Commercial Complex',
      deliveryInstructions: 'Leave with guard',
    };
  });

  const [deliveryInstructions, setDeliveryInstructions] = useState('Leave with guard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('alex@okaxis');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New address form toggle
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newLocality, setNewLocality] = useState(location.locality);
  const [newCity, setNewCity] = useState(location.city);
  const [newPincode, setNewPincode] = useState('201310');
  const [newLandmark, setNewLandmark] = useState('');
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');

  if (items.length === 0 || !restaurant) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Your basket is empty</h2>
        <p className="text-xs text-gray-500">Add dishes before proceeding to checkout.</p>
        <button
          onClick={onBack}
          className="py-2.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      street: newStreet,
      locality: newLocality,
      city: newCity,
      state: 'Uttar Pradesh',
      pincode: newPincode,
      landmark: newLandmark,
    };
    setSelectedAddress(newAddr);
    setShowAddAddress(false);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        userId: user?.id || 'user-customer-1',
        customerName: user?.name || 'Aarav Sharma',
        customerPhone: user?.phone || '+91 98112 34567',
        restaurantId: restaurant.id,
        items,
        deliveryAddress: selectedAddress,
        deliveryInstructions,
        paymentMethod,
        couponCode: coupon?.code,
        tip,
      };

      const createdOrder = await api.createOrder(orderPayload);
      clearCart();
      onOrderSuccess(createdOrder.id);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/60 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </button>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Complete Your Order</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Address, Instructions, Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. DELIVERY ADDRESS */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Delivery Address</h3>
                </div>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAddAddress ? 'Cancel' : 'Add New Address'}
                </button>
              </div>

              {/* Saved Addresses List */}
              {!showAddAddress ? (
                <div className="space-y-2">
                  {(user?.savedAddresses || [selectedAddress]).map((addr) => {
                    const isSelected = selectedAddress.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-md">
                            {addr.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                        </div>
                        <p className="text-xs font-semibold text-gray-900 mt-2">{addr.street}</p>
                        <p className="text-xs text-gray-500">
                          {addr.locality}, {addr.city}, UP - {addr.pincode}
                        </p>
                        {addr.landmark && (
                          <p className="text-[11px] text-gray-400 mt-0.5">Landmark: {addr.landmark}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Add New Address Form */
                <form onSubmit={handleSaveNewAddress} className="space-y-3 pt-2">
                  <div className="flex gap-2">
                    {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setNewLabel(lbl)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                          newLabel === lbl ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="House / Flat / Tower / Street"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Locality (e.g. Sector Alpha 1)"
                      value={newLocality}
                      onChange={(e) => setNewLocality(e.target.value)}
                      className="px-3 py-2 text-xs border border-gray-200 rounded-xl"
                    />
                    <input
                      type="text"
                      required
                      placeholder="City (e.g. Greater Noida)"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="px-3 py-2 text-xs border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Pincode (e.g. 201310)"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      className="px-3 py-2 text-xs border border-gray-200 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Nearby Landmark (Optional)"
                      value={newLandmark}
                      onChange={(e) => setNewLandmark(e.target.value)}
                      className="px-3 py-2 text-xs border border-gray-200 rounded-xl"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs"
                  >
                    Save & Use This Address
                  </button>
                </form>
              )}

              {/* Delivery Instructions */}
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Delivery Instructions for Courier Rider:
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    'Leave with guard',
                    'Avoid calling',
                    'Don’t ring bell',
                    'Leave at doorstep',
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setDeliveryInstructions(chip)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        deliveryInstructions === chip
                          ? 'bg-orange-100 text-orange-800 border-orange-300 font-bold'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Call when entering Eldeco / Sharda gate"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            {/* 2. PAYMENT METHOD (RAZORPAY SANDBOX PROTOCOL) */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Payment Method</h3>
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Razorpay Sandbox Active
                </span>
              </div>

              <div className="space-y-2.5">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          Instant UPI (GPay, PhonePe, Paytm, QR)
                        </p>
                        <p className="text-[11px] text-gray-500">Zero transaction charges</p>
                      </div>
                    </div>
                    {paymentMethod === 'upi' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-orange-200/60 flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                      />
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-200">
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* Cards Option */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">Credit / Debit Card</p>
                        <p className="text-[11px] text-gray-500">Visa, Mastercard, RuPay, Amex</p>
                      </div>
                    </div>
                    {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                  </div>
                </div>

                {/* Net Banking Option */}
                <div
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Building className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">Net Banking</p>
                        <p className="text-[11px] text-gray-500">SBI, HDFC, ICICI, Axis Bank</p>
                      </div>
                    </div>
                    {paymentMethod === 'netbanking' && (
                      <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Banknote className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">Cash on Delivery (COD)</p>
                        <p className="text-[11px] text-gray-500">Pay cash or UPI to rider at door</p>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Bill */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                Order Summary ({restaurant.name})
              </h3>

              {/* Items List */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={it.cartItemId} className="flex justify-between items-start text-xs">
                    <div className="flex items-start gap-1.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                          it.menuItem.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      <div>
                        <p className="font-bold text-gray-800">
                          {it.menuItem.name} <span className="text-gray-400">x{it.quantity}</span>
                        </p>
                        {it.selectedOptions?.length > 0 && (
                          <p className="text-[10px] text-gray-400">
                            {it.selectedOptions.map((o) => o.optionName).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">₹{it.itemTotal}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Partner Tip */}
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Tip Your Delivery Partner:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 20, 30, 50].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTip(amount)}
                      className={`py-1 text-xs font-bold rounded-lg border transition-colors ${
                        tip === amount
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {amount === 0 ? 'None' : `₹${amount}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Itemized Bill */}
              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Restaurant Packaging (5% GST)</span>
                  <span className="font-semibold text-gray-900">₹{tax}</span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Rider Tip</span>
                    <span className="font-semibold text-gray-900">₹{tip}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-extrabold text-gray-900">
                  <span>Total Payable</span>
                  <span className="text-orange-600">₹{grandTotal}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl text-sm shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment via Razorpay...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{grandTotal} & Place Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
