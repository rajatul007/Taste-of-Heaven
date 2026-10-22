import React, { useState, useEffect } from 'react';
import { Clock, MapPin, ArrowRight, RotateCcw, Star, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface OrderHistoryPageProps {
  onTrackOrder: (orderId: string) => void;
  onExploreRestaurants: () => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({
  onTrackOrder,
  onExploreRestaurants,
}) => {
  const { user } = useAuth();
  const { addItem, clearCart, setIsCartDrawerOpen } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewedOrders, setReviewedOrders] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      try {
        const data = await api.getUserOrders(user?.id || 'user-customer-1');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const handleReorder = async (order: Order) => {
    try {
      const data = await api.getRestaurantByIdOrSlug(order.restaurantId);
      clearCart();
      order.items.forEach((it) => {
        addItem(it.menuItem, it.quantity, it.selectedOptions || [], data.restaurant);
      });
      setIsCartDrawerOpen(true);
    } catch (e) {
      console.error('Failed to reorder', e);
    }
  };

  const handleRateOrder = (orderId: string, rating: number) => {
    setReviewedOrders((prev) => ({ ...prev, [orderId]: rating }));
    alert(`Thank you! Your ${rating}-star review has been recorded.`);
  };

  return (
    <div className="min-h-screen bg-stone-50/60 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Your Past Orders</h1>
          <p className="text-xs text-gray-500">Track current deliveries or reorder your favorite meals</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-white rounded-3xl border border-gray-200 animate-pulse p-6" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No orders placed yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Explore authentic restaurants in Greater Noida and Delhi NCR to place your first order.
            </p>
            <button
              onClick={onExploreRestaurants}
              className="py-2.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Discover Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{ord.restaurantName}</h3>
                    <p className="text-xs text-gray-500">{ord.restaurantAddress}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Order #{ord.orderNumber} • {new Date(ord.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-100 text-orange-800 animate-pulse'
                      }`}
                    >
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1.5 text-xs text-gray-700">
                  {ord.items.map((it) => (
                    <div key={it.cartItemId} className="flex justify-between">
                      <span>
                        {it.menuItem.name} x{it.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">₹{it.itemTotal}</span>
                    </div>
                  ))}
                </div>

                {/* Bill & Actions */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">Total Paid: </span>
                    <span className="text-base font-black text-gray-900">₹{ord.total}</span>
                    <span className="text-gray-400 ml-1">({ord.paymentMethod.toUpperCase()})</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Rate order */}
                    {ord.orderStatus === 'delivered' && (
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200">
                        <span className="text-[10px] font-bold text-amber-800">Rate:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateOrder(ord.id, star)}
                            className="text-amber-500 hover:scale-125 transition-transform"
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                (reviewedOrders[ord.id] || 0) >= star ? 'fill-amber-500' : ''
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Reorder Button */}
                    <button
                      onClick={() => handleReorder(ord)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 hover:border-orange-500 text-orange-600 hover:bg-orange-50 font-bold transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reorder
                    </button>

                    {/* Track Live */}
                    <button
                      onClick={() => onTrackOrder(ord.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                    >
                      <span>Track Status</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
