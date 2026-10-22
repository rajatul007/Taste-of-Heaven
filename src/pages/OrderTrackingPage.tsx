import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  AlertCircle,
  Play,
  Pause,
  KeyRound,
  ShieldCheck,
  Store,
  Navigation,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';

interface OrderTrackingPageProps {
  orderId: string;
  onBack: () => void;
  onExploreMore: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orderId,
  onBack,
  onExploreMore,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bikeProgress, setBikeProgress] = useState(55); // percentage along route
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  const stepsOrder: OrderStatus[] = [
    'confirmed',
    'preparing',
    'driver_assigned',
    'at_restaurant',
    'ready_for_pickup',
    'out_for_delivery',
    'arrived',
    'delivered',
  ];

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);
      try {
        const data = await api.getOrder(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  // Animated courier icon movement along the simulated route
  useEffect(() => {
    if (order?.orderStatus === 'out_for_delivery') {
      const interval = setInterval(() => {
        setBikeProgress((prev) => {
          if (prev >= 88) return 35;
          return prev + 6;
        });
      }, 2500);
      return () => clearInterval(interval);
    } else if (order?.orderStatus === 'arrived' || order?.orderStatus === 'delivered') {
      setBikeProgress(95);
    } else if (order?.orderStatus === 'at_restaurant' || order?.orderStatus === 'ready_for_pickup') {
      setBikeProgress(15);
    } else {
      setBikeProgress(5);
    }
  }, [order?.orderStatus]);

  // Auto Simulation loop to advance stages automatically
  useEffect(() => {
    if (!isAutoSimulating || !order) return;

    const timer = setInterval(async () => {
      const currentIdx = stepsOrder.indexOf(order.orderStatus);
      if (currentIdx < stepsOrder.length - 1) {
        const nextStatus = stepsOrder[currentIdx + 1];
        try {
          const updated = await api.updateOrderStatus(
            order.id,
            nextStatus,
            `Auto-advancing to: ${nextStatus.replace('_', ' ')}`
          );
          setOrder(updated);
        } catch (e) {
          console.error(e);
        }
      } else {
        setIsAutoSimulating(false);
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [isAutoSimulating, order]);

  const handleSimulateStatus = async (nextStatus: OrderStatus) => {
    if (!order) return;
    try {
      const updated = await api.updateOrderStatus(
        order.id,
        nextStatus,
        `Status simulation: ${nextStatus}`
      );
      setOrder(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const copyDeliveryOtp = () => {
    if (order?.deliveryOtp) {
      navigator.clipboard.writeText(order.deliveryOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  if (isLoading || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-gray-700">Connecting to live kitchen & rider satellite beacon...</p>
      </div>
    );
  }

  const steps: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      status: 'confirmed',
      label: 'Order Confirmed',
      desc: 'Restaurant acknowledged and placed in queue',
      icon: CheckCircle2,
    },
    {
      status: 'preparing',
      label: 'Kitchen Cooking',
      desc: 'Chef is baking & preparing dishes',
      icon: ChefHat,
    },
    {
      status: 'driver_assigned',
      label: 'Rider Assigned',
      desc: 'Ramesh Kumar (Ather 450X) assigned and en route to kitchen',
      icon: Bike,
    },
    {
      status: 'at_restaurant',
      label: 'Rider at Restaurant',
      desc: 'Waiting at restaurant dispatch counter',
      icon: Store,
    },
    {
      status: 'ready_for_pickup',
      label: 'Packed & Sealed',
      desc: 'Thermal insulated packaging with tamper-proof seal',
      icon: PackageCheck,
    },
    {
      status: 'out_for_delivery',
      label: 'Out for Delivery',
      desc: 'Rider on electric scooter heading to your address',
      icon: Navigation,
    },
    {
      status: 'arrived',
      label: 'Rider Arrived',
      desc: 'Rider has reached your building / gate',
      icon: MapPin,
    },
    {
      status: 'delivered',
      label: 'Delivered',
      desc: 'Handed over at doorstep. Enjoy your meal!',
      icon: CheckCircle2,
    },
  ];

  const currentStepIdx = steps.findIndex((s) => s.status === order.orderStatus);

  // Status-specific banner message
  const getStatusBanner = () => {
    switch (order.orderStatus) {
      case 'confirmed':
        return { title: 'Order Confirmed!', desc: 'Kitchen is preparing your ingredients.', eta: '~30 mins' };
      case 'preparing':
        return { title: 'Food is Being Cooked', desc: 'Freshly prepared with care and hygiene.', eta: '~25 mins' };
      case 'driver_assigned':
        return { title: 'Delivery Partner Assigned!', desc: 'Ramesh Kumar is heading to the restaurant.', eta: '~20 mins' };
      case 'at_restaurant':
        return { title: 'Rider Reached Restaurant', desc: 'Rider is waiting for parcel packaging.', eta: '~18 mins' };
      case 'ready_for_pickup':
        return { title: 'Order Packed & Sealed', desc: 'Handing over to delivery partner right now.', eta: '~15 mins' };
      case 'out_for_delivery':
        return { title: 'Out for Delivery!', desc: 'Rider is cruising on Ather scooter towards your doorstep.', eta: '~10 mins' };
      case 'arrived':
        return { title: 'Rider Has Arrived!', desc: 'Rider is at your gate / door. Please share delivery OTP.', eta: 'At Doorstep' };
      case 'delivered':
        return { title: 'Order Delivered!', desc: 'Hope you loved your heavenly meal.', eta: 'Delivered' };
      default:
        return { title: 'Order in Progress', desc: 'Tracking active.', eta: '~20 mins' };
    }
  };

  const statusBanner = getStatusBanner();

  return (
    <div className="min-h-screen bg-stone-50/60 pb-28">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400">Order ID:</span>
            <span className="text-xs font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
              #{order.orderNumber}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* TOP STATUS HERO CARD */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Live Swiggy-Style Tracking
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs font-semibold text-gray-500">
                  {order.restaurantName}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                {statusBanner.title}
              </h1>
              <p className="text-xs text-gray-500 mt-1 max-w-md">{statusBanner.desc}</p>
            </div>

            {/* Estimated Arrival Time Pill */}
            <div className="p-3.5 bg-gradient-to-tr from-orange-50 to-amber-50 rounded-2xl border border-orange-200/70 text-right shrink-0">
              <p className="text-[10px] text-orange-950 font-bold uppercase tracking-wider">
                Estimated Arrival
              </p>
              <p className="text-xl sm:text-2xl font-black text-orange-600">{statusBanner.eta}</p>
            </div>
          </div>

          {/* DELIVERY OTP BADGE */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                  Delivery Confirmation OTP
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold">
                    Safe Contactless
                  </span>
                </p>
                <p className="text-[11px] text-amber-800">
                  Share this 4-digit code with delivery partner Ramesh Kumar at your doorstep
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-2xl font-mono font-black text-gray-900 tracking-widest bg-white px-3 py-1 rounded-xl border border-amber-300 shadow-inner">
                {order.deliveryOtp || '4892'}
              </span>
              <button
                onClick={copyDeliveryOtp}
                className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                {copiedOtp ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* SIMULATED LIVE MAP ROUTE VISUALIZATION */}
          <div className="relative h-56 sm:h-64 bg-gradient-to-br from-stone-100 via-amber-50/40 to-orange-50/30 rounded-3xl overflow-hidden border border-gray-200 flex flex-col justify-between p-4 shadow-inner">
            {/* Visual Road Grid Pattern */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Top Bar on Map */}
            <div className="relative z-10 flex items-center justify-between text-xs font-bold bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-gray-200 shadow-sm max-w-sm">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                Live Satellite GPS Active
              </span>
              <span className="text-gray-400 font-normal">NCR Transit Sector</span>
            </div>

            {/* Route Track & Moving Bike Simulation */}
            <div className="relative my-auto w-full px-8 py-4">
              {/* Road track */}
              <div className="h-3 bg-gray-200 rounded-full w-full relative overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${Math.min(100, Math.max(10, bikeProgress))}%` }}
                />
              </div>

              {/* Kitchen Origin Marker */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <ChefHat className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 bg-white/95 px-2 py-0.5 rounded shadow-xs mt-1 whitespace-nowrap">
                  {order.restaurantName}
                </span>
              </div>

              {/* Moving Courier Bike Icon */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-in-out"
                style={{ left: `${Math.min(88, Math.max(14, bikeProgress))}%` }}
              >
                <div className="w-11 h-11 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-xl border-2 border-amber-400 ring-4 ring-amber-400/20">
                  <Bike className="w-6 h-6 text-amber-400 animate-bounce" />
                </div>
                <span className="text-[10px] font-black text-white bg-stone-900 px-2 py-0.5 rounded shadow-md mt-1 whitespace-nowrap block text-center">
                  Ramesh (UP16)
                </span>
              </div>

              {/* Customer Doorstep Pin */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 bg-white/95 px-2 py-0.5 rounded shadow-xs mt-1 whitespace-nowrap">
                  Your Address
                </span>
              </div>
            </div>

            {/* Bottom Map Note */}
            <div className="relative z-10 text-[11px] text-gray-700 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-gray-200 self-start shadow-xs flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>Delivering to: <strong className="text-gray-900">{order.deliveryAddress.street}, {order.deliveryAddress.locality}</strong></span>
            </div>
          </div>

          {/* COURIER RIDER & RESTAURANT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Courier Partner Card */}
            {order.riderInfo && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                    RK
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {order.riderInfo.name}
                      </p>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                        ★ {order.riderInfo.rating || 4.9}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {order.riderInfo.vehicleModel || 'Electric Scooter'} • {order.riderInfo.vehicleNumber}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium">
                      ✓ Vaccinated & Temperature Checked
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <a
                    href={`tel:${order.riderInfo.phone}`}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Driver</span>
                  </a>
                  <button
                    onClick={() => alert(`Message sent to rider: "Please leave order with security if not available."`)}
                    className="p-2 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
                    title="Send quick note"
                  >
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            )}

            {/* Restaurant Kitchen Card */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {order.restaurantName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{order.restaurantAddress}</p>
                  <p className="text-[11px] text-orange-600 font-semibold">
                    ✓ Clean Kitchen Certified
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <a
                  href={`tel:${order.restaurantPhone || '+919818234516'}`}
                  className="flex-1 py-2 px-3 bg-white hover:bg-gray-100 text-gray-800 font-bold border border-gray-200 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                  <span>Call Restaurant</span>
                </a>
              </div>
            </div>
          </div>

          {/* STATUS LIFECYCLE TIMELINE (SWIGGY STYLE) */}
          <div className="mt-8 space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Step-by-Step Delivery Progress
            </h3>

            <div className="relative pl-7 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {steps.map((step, idx) => {
                const isCompleted = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                        isCompleted
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-white border-2 border-gray-300 text-gray-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div>
                      <p
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-orange-600'
                            : isCompleted
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.label}{' '}
                        {isCurrent && (
                          <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.2 rounded-full ml-1">
                            Current Stage
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIMULATION CONTROLS */}
          <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-amber-600" />
                Live Stage Testing Controls:
              </span>

              {/* Auto play button */}
              <button
                onClick={() => setIsAutoSimulating(!isAutoSimulating)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-colors ${
                  isAutoSimulating
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                {isAutoSimulating ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    Pause Auto-Advance
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Auto-Advance (Watch Live)
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {stepsOrder.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setIsAutoSimulating(false);
                    handleSimulateStatus(st);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border capitalize transition-colors ${
                    order.orderStatus === st
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-white text-gray-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ORDER ITEMS & BILL BREAKDOWN */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-gray-900">Items Ordered ({order.items.length})</h3>
          <div className="space-y-2">
            {order.items.map((it) => (
              <div key={it.cartItemId} className="flex justify-between items-center text-xs">
                <span className="text-gray-800">
                  {it.menuItem.name} <strong className="text-gray-500">x{it.quantity}</strong>
                </span>
                <span className="font-bold text-gray-900">₹{it.itemTotal}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 text-xs space-y-1.5">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery & GST</span>
              <span>₹{order.deliveryFee + order.tax}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Saved</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-gray-900 pt-1">
              <span>Total Paid</span>
              <span className="text-orange-600">₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
