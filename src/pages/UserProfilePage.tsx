import React, { useState } from 'react';
import { User, MapPin, Heart, Shield, Phone, Mail, Plus, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Address } from '../types';

interface UserProfilePageProps {
  onBack: () => void;
  onSelectRestaurant: (slugOrId: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ onBack, onSelectRestaurant }) => {
  const { user, switchDemoRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'favorites'>('profile');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Please Sign In</h2>
        <p className="text-xs text-gray-500">Sign in to view your profile and saved addresses.</p>
        <button
          onClick={onBack}
          className="py-2.5 px-6 bg-orange-600 text-white font-bold rounded-xl text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/60 pb-24">
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
            User Account Settings
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-orange-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {user.email}
              </p>
              {user.phone && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {user.phone}
                </p>
              )}
            </div>
          </div>

          {/* Role switcher for quick demo testing */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Test Role:</span>
            <select
              value={user.role}
              onChange={(e) => switchDemoRole(e.target.value as any)}
              className="text-xs font-bold px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
            >
              <option value="customer">Customer</option>
              <option value="restaurant_owner">Resto Owner</option>
              <option value="admin">Platform Admin</option>
            </select>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'profile' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'addresses' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Saved Delivery Addresses ({user.savedAddresses?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400">Account ID:</span>
                <p className="font-bold text-gray-900 mt-0.5">{user.id}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400">Default Region:</span>
                <p className="font-bold text-gray-900 mt-0.5">Greater Noida, Uttar Pradesh</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.savedAddresses?.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        Default Address
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-gray-900 text-sm mt-1">{addr.street}</p>
                  <p className="text-gray-500">
                    {addr.locality}, {addr.city}, UP - {addr.pincode}
                  </p>
                  {addr.deliveryInstructions && (
                    <p className="text-gray-400 text-[11px]">Note: {addr.deliveryInstructions}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
