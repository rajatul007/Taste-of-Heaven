import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Percent,
  ShoppingBag,
  User as UserIcon,
  ChevronDown,
  Navigation,
  LogOut,
  UtensilsCrossed,
  Shield,
  ChefHat,
  History,
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onNavigate, currentRoute }) => {
  const { location, setIsLocationModalOpen } = useLocation();
  const { itemCount, grandTotal, setIsCartDrawerOpen } = useCart();
  const { user, isAuthenticated, logout, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand & Location Selector */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 group text-left focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform relative">
              <UtensilsCrossed className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-300 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 bg-clip-text text-transparent">
                Taste of Heaven
              </span>
              <span className="hidden sm:block text-[10px] font-bold text-gray-500 tracking-wider uppercase">
                Greater Noida & NCR
              </span>
            </div>
          </button>

          {/* Location Trigger */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-orange-50/70 border border-transparent hover:border-orange-200 transition-all text-left max-w-[240px]"
          >
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              {location.isUsingGPS ? (
                <Navigation className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-900 truncate">
                  {location.locality}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
              </div>
              <p className="text-[11px] text-gray-500 truncate">{location.city}</p>
            </div>
          </button>
        </div>

        {/* Central Search Bar (Swiggy Style) */}
        <div className="flex-1 max-w-lg hidden sm:block">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-gray-100/80 hover:bg-gray-100 rounded-xl text-left border border-gray-200/60 transition-colors group cursor-text"
          >
            <Search className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm text-gray-500 truncate">
              Search for 'Appitito', 'Barbeque Nation', 'Pizza', 'Burger King'...
            </span>
            <span className="ml-auto text-[10px] font-semibold bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-400">
              ⌘K
            </span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 text-gray-600 hover:text-orange-600 rounded-xl hover:bg-orange-50"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Offers Button */}
          <button
            onClick={() => onNavigate('/offers')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              currentRoute === '/offers'
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
            }`}
          >
            <Percent className="w-4 h-4 text-orange-500" />
            <span>Offers</span>
            <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase">
              New
            </span>
          </button>

          {/* User Account Menu */}
          <div className="relative">
            {isAuthenticated && user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-orange-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </p>
                  <span className="text-[10px] text-orange-600 font-semibold capitalize">
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden lg:block" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                onMouseLeave={() => setIsUserMenuOpen(false)}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 text-left transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  My Profile & Addresses
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate('/orders');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 text-left transition-colors"
                >
                  <History className="w-4 h-4 text-gray-400" />
                  Order History & Reviews
                </button>

                {/* Role Switch Links */}
                <div className="pt-1 mt-1 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('/owner');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 text-left transition-colors"
                  >
                    <ChefHat className="w-4 h-4 text-amber-500" />
                    Restaurant Owner Portal
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('/admin');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 text-left transition-colors"
                  >
                    <Shield className="w-4 h-4 text-indigo-500" />
                    Admin Command Center
                  </button>
                </div>

                <div className="pt-1 mt-1 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Button with Counter */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-md shadow-orange-500/25 transition-all group"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold hidden sm:inline">
              {itemCount > 0 ? `₹${grandTotal}` : 'Cart'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
