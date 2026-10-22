import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
  onExploreRestaurants: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onExploreRestaurants }) => {
  const {
    items,
    restaurant,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    discount,
    grandTotal,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput.trim());
    setIsApplying(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-orange-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Your Basket</h3>
              {restaurant ? (
                <p className="text-xs text-gray-500 truncate max-w-[220px]">
                  From <span className="font-semibold text-gray-800">{restaurant.name}</span>
                </p>
              ) : (
                <p className="text-xs text-gray-400">0 items</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-gray-800">Your cart is empty</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore delicious dishes from verified restaurants in Greater Noida and Delhi NCR!
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onExploreRestaurants();
                }}
                className="mt-2 py-2 px-5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                          item.menuItem.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {item.menuItem.name}
                        </p>
                        {item.selectedOptions?.length > 0 && (
                          <p className="text-[11px] text-gray-500 line-clamp-1">
                            {item.selectedOptions.map((o) => o.optionName).join(', ')}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-gray-700 mt-1">
                          ₹{item.itemTotal}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="text-gray-500 hover:text-orange-600"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="text-xs font-bold text-gray-800 w-3 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="text-gray-500 hover:text-orange-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Applicator */}
              <div className="pt-2 border-t border-gray-100">
                {coupon ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800">{coupon.code} Applied</p>
                        <p className="text-[11px] text-emerald-600">Saved ₹{discount} on this order</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Promo code (e.g. RUSH50)"
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg uppercase font-semibold focus:outline-hidden focus:border-orange-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isApplying}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Bill Details */}
              <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Partner Fee</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Government Taxes & Packaging (5% GST)</span>
                  <span className="font-semibold text-gray-900">₹{tax}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                  <span>To Pay</span>
                  <span className="text-orange-600">₹{grandTotal}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer CTA */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white">
            <button
              onClick={() => {
                setIsCartDrawerOpen(false);
                onCheckout();
              }}
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm flex items-center justify-between shadow-lg shadow-orange-500/25 transition-all"
            >
              <div className="text-left">
                <p className="text-xs font-normal opacity-90">{items.length} dishes</p>
                <p className="text-sm font-extrabold">₹{grandTotal}</p>
              </div>
              <div className="flex items-center gap-1">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
