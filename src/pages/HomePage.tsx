import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Percent,
  UtensilsCrossed,
  Bike,
  Tag,
  Calendar,
  Flame,
  Award,
  ChevronRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Restaurant } from '../types';
import { api } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { RestaurantCard } from '../components/RestaurantCard';
import { DineoutBookingModal } from '../components/DineoutBookingModal';

interface HomePageProps {
  onSelectRestaurant: (slugOrId: string) => void;
  onOpenSearch: () => void;
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectRestaurant,
  onOpenSearch,
  onNavigate,
}) => {
  const { location, selectLocality, setIsLocationModalOpen } = useLocation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Mode: 'delivery' | 'dineout'
  const [activeMode, setActiveMode] = useState<'delivery' | 'dineout'>('delivery');

  // Filters state
  const [activeRegion, setActiveRegion] = useState<string>('greater-noida');
  const [activeLocality, setActiveLocality] = useState<string>('all');
  const [activeCuisine, setActiveCuisine] = useState<string>('all');
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);
  const [dineoutOffersOnly, setDineoutOffersOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Modal for table reservation
  const [selectedDineoutResto, setSelectedDineoutResto] = useState<Restaurant | null>(null);

  // Load restaurants from backend API
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await api.getRestaurants({
          region: activeRegion === 'all' ? undefined : activeRegion,
          locality: activeLocality === 'all' ? undefined : activeLocality,
          cuisine: activeCuisine === 'all' ? undefined : activeCuisine,
          isVeg: pureVegOnly,
          rating: minRating,
          sort: sortBy,
        });
        setRestaurants(data);
      } catch (err) {
        console.error('Failed to load restaurants', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [activeRegion, activeLocality, activeCuisine, pureVegOnly, minRating, sortBy]);

  // Sync active locality from location context if changed
  useEffect(() => {
    const city = location.city.toLowerCase();
    if (city === 'greater noida') {
      setActiveRegion('greater-noida');
      if (['alpha 1', 'alpha 2', 'beta 1', 'beta 2', 'knowledge park 2', 'knowledge park iii', 'pari chowk'].includes(location.locality.toLowerCase())) {
        setActiveLocality(location.locality);
      }
    } else if (city === 'noida') {
      setActiveRegion('noida');
      setActiveLocality('all');
    } else if (city === 'delhi' || city === 'new delhi') {
      setActiveRegion('delhi');
      setActiveLocality('all');
    } else if (city === 'gurugram' || city === 'gurgaon') {
      setActiveRegion('gurugram');
      setActiveLocality('all');
    }
  }, [location]);

  // Filter restaurants by mode (Dineout vs Delivery)
  const displayedRestaurants = useMemo(() => {
    let list = [...restaurants];

    if (activeMode === 'dineout') {
      list = list.filter((r) => r.hasDineout || r.tableBookingAvailable);
      if (dineoutOffersOnly) {
        const offerRestos = list.filter((r) => Boolean(r.dineoutDiscount));
        if (offerRestos.length > 0) list = offerRestos;
      }
    } else {
      list = list.filter((r) => r.homeDeliveryAvailable);
      if (fastDeliveryOnly) {
        const fastRestos = list.filter((r) => r.deliveryTimeMins <= 30);
        if (fastRestos.length > 0) list = fastRestos;
      }
    }

    // Never return empty: if list is empty, return all loaded restaurants
    if (list.length === 0 && restaurants.length > 0) {
      return restaurants;
    }

    return list;
  }, [restaurants, activeMode, fastDeliveryOnly, dineoutOffersOnly]);

  // Iconic Chain Restaurants for the top chain carousel (Swiggy style)
  const topChains = useMemo(() => {
    const chainSlugs = [
      'barbeque-nation-greater-noida',
      'burger-king-omaxe-mall',
      'appitito',
      'bikanervala-pari-chowk',
      'subway-kp2',
      'dominos-alpha1',
      'nirulas-alpha1',
      'banzara-bliss',
      'cyber-hub-social',
      'burma-burma-noida',
      'moti-mahal-cp',
    ];
    return restaurants.filter((r) => chainSlugs.includes(r.slug) || r.isFeatured);
  }, [restaurants]);

  // Swiggy Cravings
  const circularCuisines = [
    {
      name: 'Biryani',
      category: 'biryani',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=240&q=80',
    },
    {
      name: 'Pizzas',
      category: 'pizza',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=240&q=80',
    },
    {
      name: 'Burgers',
      category: 'burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=240&q=80',
    },
    {
      name: 'North Indian',
      category: 'north indian',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=240&q=80',
    },
    {
      name: 'South Indian',
      category: 'south indian',
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=240&q=80',
    },
    {
      name: 'Chole Bhature',
      category: 'chole bhature',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=240&q=80',
    },
    {
      name: 'Rolls & Wraps',
      category: 'rolls',
      image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=240&q=80',
    },
    {
      name: 'Grill & Buffet',
      category: 'grill',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=240&q=80',
    },
    {
      name: 'Desserts & Ice Cream',
      category: 'ice cream',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=240&q=80',
    },
    {
      name: 'Momos & Asian',
      category: 'momos',
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=240&q=80',
    },
  ];

  const handleCuisineClick = (category: string) => {
    if (activeCuisine.toLowerCase() === category.toLowerCase()) {
      setActiveCuisine('all');
    } else {
      setActiveCuisine(category);
    }
    const el = document.getElementById('restaurants-view');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950 pb-24">
      {/* SWIGGY-STYLE HERO / HEADER PROMO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/90 via-amber-50/40 to-stone-50 dark:from-stone-900 dark:via-stone-900/60 dark:to-stone-950 pt-6 pb-8 sm:pt-8 sm:pb-12 border-b border-orange-100/60 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 text-xs font-black border border-orange-200 dark:border-orange-800 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin" />
                <span>Taste of Heaven • Greater Noida & Delhi NCR</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                Order food & book tables from{' '}
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 bg-clip-text text-transparent underline decoration-amber-400 decoration-wavy decoration-2">
                  top restaurants near you
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-600 dark:text-stone-300 leading-relaxed max-w-xl">
                Get hot meals delivered to your doorstep in 20-30 minutes, or reserve dineout tables with flat 20% to 35% dining discount across Greater Noida, Noida, Delhi & Gurugram.
              </p>

              {/* Quick Search & Location Bar */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch gap-2.5 max-w-xl">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800 hover:border-orange-500 shadow-sm transition-all text-left group shrink-0 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">
                      Delivering to
                    </p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                      {location.locality}, {location.city}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="flex-1 flex items-center justify-between px-4 py-3 bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800 hover:border-orange-500 shadow-sm text-gray-400 text-xs sm:text-sm font-medium transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Search className="w-4 h-4 text-orange-500" />
                    <span className="truncate">Search for dishes, restaurants or cuisines...</span>
                  </div>
                  <span className="shrink-0 px-3 py-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                    Search Food
                  </span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600 dark:text-stone-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Live GPS Order Tracking
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Instant Dineout Discounts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  100% Verified Menus
                </span>
              </div>
            </div>

            {/* Right Promotional Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="bg-gradient-to-tr from-orange-600 via-amber-600 to-rose-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black tracking-wider uppercase bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full">
                    {activeMode === 'dineout' ? '🍽️ Dineout Club' : '🛵 Doorstep Delivery'}
                  </span>
                  <Percent className="w-5 h-5 text-amber-200" />
                </div>
                <h3 className="text-2xl font-black mb-1">
                  {activeMode === 'dineout' ? 'FLAT 25%–35% OFF' : 'FLAT 50% OFF'}
                </h3>
                <p className="text-xs text-orange-100 mb-4">
                  {activeMode === 'dineout'
                    ? 'Reserve tables at Barbeque Nation, Appitito, Cyber Hub Social, and more with instant confirmed vouchers and zero booking fee.'
                    : 'Use coupon code RUSH50 on checkout to get 50% off on your hot food delivery across Delhi NCR.'}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-white/20 text-xs">
                  <span>
                    {activeMode === 'dineout' ? 'Guaranteed table reservation' : 'Free delivery above ₹499'}
                  </span>
                  <button
                    onClick={() => {
                      if (activeMode === 'dineout') {
                        const el = document.getElementById('restaurants-view');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onNavigate('/offers');
                      }
                    }}
                    className="font-bold underline hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    {activeMode === 'dineout' ? 'Explore Dineout Restos ↓' : 'View All Offers →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SWIGGY STYLE STICKY UNIFIED MENU & FILTER BAR */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-gray-200 dark:border-stone-800 shadow-xs py-3 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* 1. DUAL MODE SWITCHER: DELIVERY vs DINEOUT */}
          <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shrink-0">
            <button
              onClick={() => setActiveMode('delivery')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeMode === 'delivery'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                  : 'text-stone-600 dark:text-stone-300 hover:text-orange-600'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>🛵 Food Delivery</span>
            </button>
            <button
              onClick={() => setActiveMode('dineout')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeMode === 'dineout'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-stone-600 dark:text-stone-300 hover:text-orange-600'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>🍽️ Dineout & Discounts</span>
              <span className="hidden sm:inline-block text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.2 font-black rounded-md uppercase">
                Up to 35% OFF
              </span>
            </button>
          </div>

          {/* 2. CITY SELECTOR TABS (Greater Noida, Noida, Delhi, Gurugram, All) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none py-0.5">
            {[
              { id: 'greater-noida', label: '📍 Greater Noida' },
              { id: 'noida', label: '📍 Noida (Sec 18, 132)' },
              { id: 'delhi', label: '📍 New Delhi (CP, Safdarjung)' },
              { id: 'gurugram', label: '📍 Gurugram (Cyber Hub)' },
              { id: 'all', label: '🌐 All Delhi NCR' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveRegion(tab.id);
                  setActiveLocality('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeRegion === tab.id
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-orange-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 3. SORT & QUICK ATTRIBUTES */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="rating">Top Rated (4.5+ ★)</option>
              <option value="deliveryTime">Fastest Delivery</option>
              <option value="costAsc">Cost: Low to High</option>
              <option value="costDesc">Cost: High to Low</option>
            </select>
          </div>
        </div>

        {/* GREATER NOIDA SECTOR SUB-BAR (WHEN GREATER NOIDA IS SELECTED) */}
        {activeRegion === 'greater-noida' && (
          <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-stone-200/60 dark:border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none">
            <span className="text-[11px] font-black uppercase text-amber-800 dark:text-amber-400 shrink-0 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-600" /> Sectors:
            </span>
            {[
              { id: 'all', label: 'All Sectors' },
              { id: 'Knowledge Park 2', label: 'Knowledge Park 2 (Appitito, Subway)' },
              { id: 'Beta 2', label: 'Beta 2 (Barbeque Nation, Burger King)' },
              { id: 'Alpha 1', label: 'Alpha 1 (Nirula’s, Dominos)' },
              { id: 'Alpha 2', label: 'Alpha 2 (Banzara Bliss, Wow Momo)' },
              { id: 'Beta 1', label: 'Beta 1 (Sagar Ratna, Punjabi Chulha)' },
              { id: 'Knowledge Park III', label: 'Knowledge Park III (Paratha Gali, Rolls King)' },
              { id: 'Pari Chowk', label: 'Pari Chowk (Bikanervala)' },
              { id: 'Grand Venice Mall', label: 'Grand Venice (Yellow Chilli)' },
            ].map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setActiveLocality(loc.id);
                  if (loc.id !== 'all') {
                    selectLocality(loc.id, 'Greater Noida');
                  }
                }}
                className={`text-xs font-bold px-3 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeLocality.toLowerCase() === loc.id.toLowerCase()
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-amber-200 dark:border-stone-700 hover:border-amber-400'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        )}

        {/* QUICK FILTER CHIPS */}
        <div className="max-w-7xl mx-auto mt-2.5 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setPureVegOnly(!pureVegOnly)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              pureVegOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Pure Veg
          </button>

          <button
            onClick={() => setMinRating(minRating === 4.5 ? undefined : 4.5)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              minRating === 4.5
                ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-orange-300'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            Ratings 4.5+
          </button>

          {activeMode === 'dineout' ? (
            <button
              onClick={() => setDineoutOffersOnly(!dineoutOffersOnly)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                dineoutOffersOnly
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900 hover:bg-rose-50'
              }`}
            >
              <Tag className="w-3 h-3 text-rose-500" />
              Special Dineout Offers (25%+ OFF)
            </button>
          ) : (
            <button
              onClick={() => setFastDeliveryOnly(!fastDeliveryOnly)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                fastDeliveryOnly
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-blue-300'
              }`}
            >
              <Clock className="w-3 h-3 text-blue-500" />
              Fast Delivery (&lt;30 mins)
            </button>
          )}

          {activeCuisine !== 'all' && (
            <button
              onClick={() => setActiveCuisine('all')}
              className="text-xs font-bold px-3 py-1 bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <span>Craving: {activeCuisine}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {(activeLocality !== 'all' || pureVegOnly || minRating || fastDeliveryOnly || dineoutOffersOnly) && (
            <button
              onClick={() => {
                setActiveLocality('all');
                setActiveCuisine('all');
                setPureVegOnly(false);
                setMinRating(undefined);
                setFastDeliveryOnly(false);
                setDineoutOffersOnly(false);
              }}
              className="text-xs font-bold px-2.5 py-1 text-stone-500 hover:text-orange-600 underline transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* "WHAT'S ON YOUR MIND?" SWIGGY CIRCULAR CRAVINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-100 dark:border-stone-800">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              What's on your mind?
            </h2>
            <p className="text-xs text-gray-500 dark:text-stone-400">
              Select any craving to filter top verified kitchens delivering near you
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
          {circularCuisines.map((c) => {
            const isSelected = activeCuisine.toLowerCase() === c.category.toLowerCase();
            return (
              <button
                key={c.name}
                onClick={() => handleCuisineClick(c.category)}
                className="flex flex-col items-center gap-2 group shrink-0 focus:outline-none cursor-pointer"
              >
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-1 border-2 transition-all shadow-sm group-hover:shadow-md bg-white dark:bg-stone-800 ${
                    isSelected
                      ? 'border-orange-600 ring-2 ring-orange-400'
                      : 'border-transparent group-hover:border-orange-500'
                  }`}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="text-center">
                  <p
                    className={`text-xs font-bold transition-colors ${
                      isSelected
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-gray-800 dark:text-stone-200 group-hover:text-orange-600'
                    }`}
                  >
                    {c.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SWIGGY TOP RESTAURANT CHAINS CAROUSEL */}
      {topChains.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Top restaurant chains in Delhi NCR</span>
                <span className="text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-stone-400">
                Iconic favorites with highest customer ratings and guaranteed food hygiene
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar scrollbar-none">
            {topChains.map((chain) => (
              <div
                key={chain.id}
                onClick={() => onSelectRestaurant(chain.slug || chain.id)}
                className="w-64 sm:w-72 shrink-0 bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-gray-200/80 dark:border-stone-800 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
              >
                <div className="relative h-36 w-full overflow-hidden bg-gray-100 dark:bg-stone-800">
                  <img
                    src={chain.coverImage}
                    alt={chain.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {chain.discountOffer && (
                    <div className="absolute top-2 left-2 bg-orange-600 text-white font-black text-[10px] px-2 py-0.5 rounded shadow uppercase">
                      {chain.discountOffer}
                    </div>
                  )}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                    <span>{chain.deliveryTimeMins} mins</span>
                    <span>₹{chain.costForTwo} for two</span>
                  </div>
                </div>

                <div className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-orange-600 truncate">
                      {chain.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-white" />
                      <span>{chain.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-stone-400 truncate">
                    {chain.cuisine.slice(0, 3).join(', ')}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-stone-500 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    {chain.locality}, {chain.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DINEOUT MODE CALLOUT BANNER (WHEN DINEOUT ACTIVE) */}
      {activeMode === 'dineout' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-black bg-white/20 px-3 py-1 rounded-full">
                Taste of Heaven Dineout Club
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Book Table & Get Flat 20% to 35% OFF on Food Bills & Buffets
              </h2>
              <p className="text-xs sm:text-sm text-orange-100 max-w-2xl">
                Zero reservation fees. Instant digital table pass generation. Present the voucher at the restaurant and enjoy flat dining discounts.
              </p>
            </div>
            <button
              onClick={() => {
                const bbq = restaurants.find((r) => r.slug === 'barbeque-nation-greater-noida') || restaurants[0];
                if (bbq) setSelectedDineoutResto(bbq);
              }}
              className="py-3 px-5 rounded-2xl bg-white text-orange-700 font-black text-xs sm:text-sm shadow-md hover:bg-orange-50 transition-all cursor-pointer whitespace-nowrap"
            >
              Book Table with Discount →
            </button>
          </div>
        </section>
      )}

      {/* MAIN RESTAURANTS SECTION */}
      <section id="restaurants-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>
                {activeMode === 'dineout' ? '🍽️ Dineout Restaurants with Guaranteed Discounts' : '🛵 Restaurants with Online Food Delivery'}
              </span>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                {activeLocality !== 'all' ? activeLocality : activeRegion.replace('-', ' ').toUpperCase()}
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-stone-400">
              {activeMode === 'dineout'
                ? 'Reserve tables with verified discounts and live directions'
                : 'Fast doorstep delivery with accurate Google Maps route estimates'}
            </p>
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-stone-400">
            {displayedRestaurants.length} {displayedRestaurants.length === 1 ? 'place' : 'places'} ready to serve
          </span>
        </div>

        {/* RESTAURANTS GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 bg-white dark:bg-stone-800 rounded-2xl border border-gray-100 dark:border-stone-700 animate-pulse overflow-hidden p-4 space-y-3"
              >
                <div className="h-44 bg-gray-200 dark:bg-stone-700 rounded-xl" />
                <div className="h-4 bg-gray-200 dark:bg-stone-700 rounded-sm w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-stone-700 rounded-sm w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRestaurants.map((resto) => (
              <RestaurantCard
                key={resto.id}
                restaurant={resto}
                onSelect={onSelectRestaurant}
                isDineoutMode={activeMode === 'dineout'}
                onBookTable={(r) => setSelectedDineoutResto(r)}
              />
            ))}
          </div>
        )}
      </section>

      {/* DINEOUT TABLE BOOKING MODAL */}
      {selectedDineoutResto && (
        <DineoutBookingModal
          restaurant={selectedDineoutResto}
          isOpen={Boolean(selectedDineoutResto)}
          onClose={() => setSelectedDineoutResto(null)}
        />
      )}
    </div>
  );
};
