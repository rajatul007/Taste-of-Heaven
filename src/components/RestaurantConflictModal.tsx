import React from 'react';
import { AlertTriangle, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const RestaurantConflictModal: React.FC = () => {
  const { conflictItem, restaurant, resolveConflict } = useCart();

  if (!conflictItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 text-center">Replace Cart Items?</h3>

        <p className="text-sm text-gray-600 text-center mt-2">
          Your cart currently contains dishes from{' '}
          <span className="font-bold text-gray-900">{restaurant?.name || 'another restaurant'}</span>.
          Do you want to discard them and add items from{' '}
          <span className="font-bold text-orange-600">{conflictItem.restaurant.name}</span> instead?
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => resolveConflict(false)}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 text-sm transition-colors"
          >
            Keep Existing
          </button>
          <button
            onClick={() => resolveConflict(true)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Discard & Add
          </button>
        </div>
      </div>
    </div>
  );
};
