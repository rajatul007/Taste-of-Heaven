import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw, Store, Users, DollarSign, Calendar } from 'lucide-react';
import { Restaurant } from '../types';
import { api } from '../services/api';

interface AdminDashboardPageProps {
  onBack: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onBack }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const stats = await api.getAdminMetrics();
      setMetrics(stats);
      const allRestos = await api.getRestaurants();
      setRestaurants(allRestos);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleVerification = async (resto: Restaurant) => {
    const nextStatus = resto.verificationStatus === 'verified' ? 'unverified' : 'verified';
    try {
      await api.updateRestaurantAdmin(resto.id, {
        verificationStatus: nextStatus,
        lastVerifiedDate: new Date().toISOString().split('T')[0],
      });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleOrderingMode = async (resto: Restaurant, mode: any) => {
    try {
      await api.updateRestaurantAdmin(resto.id, { orderingMode: mode });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

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
          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            Platform Command Center
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Regional Admin Console</h1>
            <p className="text-xs text-gray-500">
              Manage verified listings, ordering rules, and platform compliance across Greater Noida and NCR
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs">
              <span className="text-xs text-gray-400 font-semibold">Total Gross GMV</span>
              <p className="text-xl font-black text-gray-900 mt-1">₹{metrics.totalGmv}</p>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs">
              <span className="text-xs text-indigo-600 font-semibold">15% Commission</span>
              <p className="text-xl font-black text-indigo-900 mt-1">₹{metrics.platformCommission}</p>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs">
              <span className="text-xs text-gray-400 font-semibold">Total Restaurants</span>
              <p className="text-xl font-black text-gray-900 mt-1">{metrics.totalRestaurants}</p>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs">
              <span className="text-xs text-emerald-600 font-semibold">Verified Kitchens</span>
              <p className="text-xl font-black text-emerald-700 mt-1">
                {metrics.verifiedRestaurants} / {metrics.totalRestaurants}
              </p>
            </div>
          </div>
        )}

        {/* Restaurant Directory Table */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900">
            Restaurant Verification & Ordering Mode Management
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Restaurant</th>
                  <th className="pb-3 font-semibold">Locality / City</th>
                  <th className="pb-3 font-semibold">Verification Status</th>
                  <th className="pb-3 font-semibold">Ordering Mode</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {restaurants.map((resto) => (
                  <tr key={resto.id} className="hover:bg-gray-50/60">
                    <td className="py-3 font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        <img
                          src={resto.coverImage}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <p>{resto.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">/{resto.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">
                      {resto.locality}, {resto.city}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleToggleVerification(resto)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          resto.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {resto.verificationStatus === 'verified' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                        )}
                        <span className="capitalize">{resto.verificationStatus}</span>
                      </button>
                    </td>
                    <td className="py-3">
                      <select
                        value={resto.orderingMode}
                        onChange={(e) => handleToggleOrderingMode(resto, e.target.value)}
                        className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold"
                      >
                        <option value="biterate_direct">BiteRush Direct</option>
                        <option value="external_official">Official Website Only</option>
                        <option value="both">Both (Dine-in + Delivery)</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <a
                        href={resto.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-600 hover:underline mr-3"
                      >
                        Maps
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
