import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check, Percent, ArrowLeft, Gift } from 'lucide-react';
import { Coupon } from '../types';
import { api } from '../services/api';

interface OffersPageProps {
  onBack: () => void;
  onExploreRestaurants: () => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onBack, onExploreRestaurants }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoupons() {
      const data = await api.getCoupons();
      setCoupons(data);
    }
    loadCoupons();
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-stone-50/60 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Restaurants</span>
          </button>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Verified Deals & Coupons
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Gift className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Active Deals & Coupons</h1>
          <p className="text-xs text-gray-500">
            Copy any promo code and apply at checkout to get instant discounts on Greater Noida & NCR deliveries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 tracking-wider">
                    {coupon.code}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Valid till {coupon.validUntil}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-900 mt-2">{coupon.description}</p>
                <p className="text-xs text-gray-500">
                  Minimum cart value: <strong className="text-gray-800">₹{coupon.minOrderAmount}</strong>
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => copyToClipboard(coupon.code)}
                  className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onExploreRestaurants}
                  className="text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  Order Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
