import React, { useEffect } from 'react';
import { CheckCircle2, MapPin, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderConfirmationPageProps {
  orderId: string;
  onTrackOrder: (orderId: string) => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderId,
  onTrackOrder,
  onContinueShopping,
}) => {
  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  return (
    <div className="min-h-screen bg-stone-50/60 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Payment & Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
            Thank you for ordering!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Your order <strong className="text-gray-900">#{orderId}</strong> has been transmitted to
            the restaurant kitchen.
          </p>
        </div>

        <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/60 flex items-center justify-around text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <div className="text-left">
              <p className="text-gray-500">Estimated Delivery</p>
              <p className="font-bold text-gray-900">25 - 35 mins</p>
            </div>
          </div>
          <div className="h-8 w-px bg-orange-200" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            <div className="text-left">
              <p className="text-gray-500">Live Rider GPS</p>
              <p className="font-bold text-emerald-700">Tracking Active</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => onTrackOrder(orderId)}
            className="w-full py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Track Order Live</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onContinueShopping}
            className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs sm:text-sm transition-colors"
          >
            Explore More Dishes
          </button>
        </div>
      </div>
    </div>
  );
};
