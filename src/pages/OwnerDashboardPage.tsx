import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, DollarSign, Package } from 'lucide-react';
import { Order, MenuItem, Restaurant } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface OwnerDashboardPageProps {
  onBack: () => void;
}

export const OwnerDashboardPage: React.FC<OwnerDashboardPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [targetRestoId, setTargetRestoId] = useState<string>('resto-appitito');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async (restoId: string) => {
    setIsLoading(true);
    try {
      const data = await api.getRestaurantByIdOrSlug(restoId);
      setRestaurant(data.restaurant);
      setMenuItems(data.menuItems);
      const restoOrders = await api.getOwnerOrders(restoId);
      setOrders(restoOrders);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(targetRestoId);
  }, [targetRestoId]);

  const handleUpdateStatus = async (orderId: string, status: any) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await loadData(targetRestoId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStock = async (dishId: string, currentStatus: boolean) => {
    try {
      await api.updateDishStock(dishId, !currentStatus);
      setMenuItems((prev) =>
        prev.map((it) => (it.id === dishId ? { ...it, isAvailable: !currentStatus } : it))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const totalKitchenRevenue = orders.reduce((sum, o) => sum + o.subtotal, 0);

  return (
    <div className="min-h-screen bg-stone-50/60 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Manage Kitchen:</span>
            <select
              value={targetRestoId}
              onChange={(e) => setTargetRestoId(e.target.value)}
              className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg"
            >
              <option value="resto-appitito">Appitito (Alpha 1)</option>
              <option value="resto-banzara-bliss">Banzara Bliss (Alpha 2)</option>
              <option value="resto-barbeque-nation-greater-noida">Barbeque Nation (Alpha 2)</option>
              <option value="resto-burger-king-omaxe-mall">Burger King (Beta 2)</option>
              <option value="resto-bikanervala-pari-chowk">Bikanervala (Pari Chowk)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Top Banner */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{restaurant?.name}</h1>
              <p className="text-xs text-gray-500">
                {restaurant?.locality}, {restaurant?.city} • Kitchen Dispatch Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <p className="text-gray-400">Total Orders</p>
              <p className="text-sm font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-center border border-amber-200">
              <p className="text-amber-800">Kitchen Revenue</p>
              <p className="text-sm font-black text-amber-900">₹{totalKitchenRevenue}</p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'orders' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Live Kitchen Queue ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'menu' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Menu & Stock Management ({menuItems.length})
          </button>
        </div>

        {/* TAB 1: LIVE ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-3xl border border-gray-200 p-6 space-y-2">
                <p className="text-sm font-bold text-gray-800">No incoming orders at the moment</p>
                <p className="text-xs text-gray-400">Orders placed by customers will appear here live</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-bold text-gray-900">Order #{ord.orderNumber}</span>
                      <p className="text-[11px] text-gray-500">
                        Customer: {ord.customerName} ({ord.customerPhone})
                      </p>
                    </div>
                    <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-orange-100 text-orange-800">
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-1 text-xs text-gray-700">
                    {ord.items.map((it) => (
                      <div key={it.cartItemId} className="flex justify-between">
                        <span>
                          {it.menuItem.name} <strong>x{it.quantity}</strong>
                        </span>
                        <span>₹{it.itemTotal}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Action Progression */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Bill: ₹{ord.total}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'preparing')}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-lg transition-colors"
                      >
                        Start Cooking
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'ready_for_pickup')}
                        className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs rounded-lg transition-colors"
                      >
                        Pack for Rider
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'delivered')}
                        className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-lg transition-colors"
                      >
                        Mark Delivered
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: MENU INVENTORY */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Manage Dish Availability & Pricing</h3>
            <div className="space-y-3">
              {menuItems.map((dish) => (
                <div
                  key={dish.id}
                  className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{dish.name}</p>
                      <p className="text-gray-500">
                        {dish.category} • ₹{dish.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleToggleStock(dish.id, dish.isAvailable)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                        dish.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
