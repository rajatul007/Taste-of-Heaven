import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Eye, EyeOff, ShieldCheck, ChefHat, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    switchDemoRole,
  } = useAuth();

  const [email, setEmail] = useState('alex@foodrush.io');
  const [password, setPassword] = useState('FoodRush123!');
  const [name, setName] = useState('Aarav Sharma');
  const [phone, setPhone] = useState('+91 98112 34567');
  const [role, setRole] = useState<UserRole>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, phone, role);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const autofillDemoAccount = (selectedRole: UserRole) => {
    setError(null);
    if (selectedRole === 'customer') {
      setEmail('alex@foodrush.io');
      setPassword('FoodRush123!');
      setName('Aarav Sharma');
      setPhone('+91 98112 34567');
      setRole('customer');
      switchDemoRole('customer');
    } else if (selectedRole === 'restaurant_owner') {
      setEmail('owner@appitito.com');
      setPassword('Owner123!');
      setName('Vikram Rajput (Appitito Cafe)');
      setPhone('+91 98182 34516');
      setRole('restaurant_owner');
      switchDemoRole('restaurant_owner');
    } else if (selectedRole === 'admin') {
      setEmail('admin@foodrush.io');
      setPassword('Admin123!');
      setName('FoodRush Regional Admin');
      setPhone('+91 99990 00001');
      setRole('admin');
      switchDemoRole('admin');
    }
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-orange-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {authModalMode === 'login' ? 'Welcome to Taste of Heaven' : 'Create Taste of Heaven Account'}
            </h3>
            <p className="text-xs text-gray-500">
              {authModalMode === 'login'
                ? 'Sign in to order heavenly food, track live riders & view offers'
                : 'Sign up to explore verified restaurants in Greater Noida & Delhi NCR'}
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Quick Demo Autofill Bar */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1.5">
            <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              1-Tap Test Accounts (Instant Sign-in):
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => autofillDemoAccount('customer')}
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-orange-500 hover:text-white border border-amber-200 rounded-lg text-[11px] font-bold text-gray-700 transition-colors shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Customer
              </button>
              <button
                type="button"
                onClick={() => autofillDemoAccount('restaurant_owner')}
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-orange-500 hover:text-white border border-amber-200 rounded-lg text-[11px] font-bold text-gray-700 transition-colors shadow-xs"
              >
                <ChefHat className="w-3.5 h-3.5" />
                Resto Owner
              </button>
              <button
                type="button"
                onClick={() => autofillDemoAccount('admin')}
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-orange-500 hover:text-white border border-amber-200 rounded-lg text-[11px] font-bold text-gray-700 transition-colors shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98112 34567"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                User ID / Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@foodrush.io"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-sm border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 text-sm transition-all"
            >
              {isLoading
                ? 'Processing...'
                : authModalMode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="pt-2 text-center text-xs text-gray-600">
            {authModalMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthModalMode('register')}
                  className="font-bold text-orange-600 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthModalMode('login')}
                  className="font-bold text-orange-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
