import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, phone?: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  switchDemoRole: (role: UserRole) => void;
}

const DEFAULT_DEMO_USER: User = {
  id: 'user-customer-1',
  name: 'Aarav Sharma',
  email: 'alex@foodrush.io',
  phone: '+91 98112 34567',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  savedAddresses: [
    {
      id: 'addr-1',
      label: 'Home',
      street: 'Flat 402, Tower B, Eldeco Green Meadows',
      locality: 'Sector Alpha 1',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      pincode: '201310',
      landmark: 'Near Alpha 1 Commercial Market',
      deliveryInstructions: 'Leave with guard if unavailable',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Work',
      street: 'Block 2, Knowledge Park III University Complex',
      locality: 'Knowledge Park III',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      pincode: '201306',
      landmark: 'Opposite Sharda Main Gate',
      deliveryInstructions: 'Call upon arrival at main reception',
      isDefault: false,
    },
  ],
  favoriteRestaurantIds: ['resto-appitito', 'resto-bikanervala-pari-chowk'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('foodrush_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_DEMO_USER;
      }
    }
    return DEFAULT_DEMO_USER; // Default to signed-in demo customer for smooth immediate UX
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('foodrush_token') || 'demo_token_123');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem('foodrush_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('foodrush_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('foodrush_token', token);
    } else {
      localStorage.removeItem('foodrush_token');
    }
  }, [token]);

  const login = async (email: string, password?: string) => {
    const data = await api.login(email, password);
    setUser(data.user);
    setToken(data.token);
    setIsAuthModalOpen(false);
  };

  const register = async (name: string, email: string, phone?: string, role: UserRole = 'customer') => {
    const data = await api.register({ name, email, phone, role });
    setUser(data.user);
    setToken(data.token);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const switchDemoRole = (role: UserRole) => {
    if (role === 'restaurant_owner') {
      setUser({
        id: 'user-owner-appitito',
        name: 'Vikram Rajput (Appitito Cafe)',
        email: 'owner@appitito.com',
        phone: '+91 98182 34516',
        role: 'restaurant_owner',
        restaurantId: 'resto-appitito',
        savedAddresses: [],
        favoriteRestaurantIds: [],
      });
    } else if (role === 'admin') {
      setUser({
        id: 'user-admin',
        name: 'FoodRush Regional Admin',
        email: 'admin@foodrush.io',
        phone: '+91 99990 00001',
        role: 'admin',
        savedAddresses: [],
        favoriteRestaurantIds: [],
      });
    } else {
      setUser(DEFAULT_DEMO_USER);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
