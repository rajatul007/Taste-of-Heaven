import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface FloatingCartBarProps {
  onViewCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ onViewCart }) => {
  const { items, itemCount, grandTotal, restaurant } = useCart();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center animate-in slide-in-from-bottom-5 duration-300">
      <button
        onClick={onViewCart}
        className="pointer-events-auto w-full max-w-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl shadow-orange-500/35 flex items-center justify-between border border-orange-400/40 transform hover:-translate-y-0.5 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
              {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'} • ₹{grandTotal}
            </p>
            {restaurant && (
              <p className="text-[11px] text-orange-100 truncate max-w-[200px] sm:max-w-xs">
                From {restaurant.name} ({restaurant.locality})
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs sm:text-sm font-black bg-white text-orange-600 px-3.5 py-1.5 rounded-xl shadow-xs group-hover:bg-orange-50 transition-colors">
          <span>VIEW CART</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
  );
};
