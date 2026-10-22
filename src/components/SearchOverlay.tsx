import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Utensils, Star, Clock, X, Plus } from 'lucide-react';
import { api } from '../services/api';
import { SearchSuggestion, MenuItem, Restaurant } from '../types';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRestaurant: (slugOrId: string) => void;
  onSelectLocality: (locality: string, city: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onSelectRestaurant,
  onSelectLocality,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();
  const { selectLocality } = useLocation();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSuggestions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await api.getSearchSuggestions(query);
        setSuggestions(results);
      } catch (e) {
        console.error('Search suggestion error', e);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const dishSuggestions = suggestions.filter((s) => s.type === 'dish');
  const restoSuggestions = suggestions.filter((s) => s.type === 'restaurant');
  const localitySuggestions = suggestions.filter((s) => s.type === 'locality');

  const handleAddDishDirectly = async (dish: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const data = await api.getRestaurantByIdOrSlug(dish.restaurantId);
      addItem(dish, 1, [], data.restaurant);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-start items-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden mt-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/70">
          <Search className="w-5 h-5 text-orange-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for restaurants, dishes (e.g. Pizza, Nihari, Whopper) or localities..."
            className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 font-medium text-base sm:text-lg focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              Searching live NCR restaurants & dishes...
            </div>
          )}

          {!isLoading && !query && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Popular Greater Noida Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Appitito Pizza', term: 'Appitito' },
                    { label: 'Banzara Bliss Mughlai', term: 'Banzara' },
                    { label: 'Barbeque Nation Buffet', term: 'Barbeque' },
                    { label: 'Burger King Whopper', term: 'Burger King' },
                    { label: 'Bikanervala Chole Bhature', term: 'Chole Bhature' },
                    { label: 'Paratha Gali KP3', term: 'Paratha' },
                    { label: 'Karim’s Mutton Nihari', term: 'Nihari' },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => setQuery(chip.term)}
                      className="text-xs font-medium px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-full border border-orange-200/60 transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Quick Locality Hubs
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'Alpha 1', city: 'Greater Noida' },
                    { name: 'Alpha 2', city: 'Greater Noida' },
                    { name: 'Beta 2', city: 'Greater Noida' },
                    { name: 'Knowledge Park III', city: 'Greater Noida' },
                    { name: 'Pari Chowk', city: 'Greater Noida' },
                    { name: 'Sector 18', city: 'Noida' },
                  ].map((loc) => (
                    <button
                      key={loc.name}
                      onClick={() => {
                        selectLocality(loc.name, loc.city);
                        onSelectLocality(loc.name, loc.city);
                        onClose();
                      }}
                      className="flex items-center gap-2 p-2.5 text-left rounded-xl hover:bg-gray-100 border border-gray-100 transition-colors group"
                    >
                      <MapPin className="w-4 h-4 text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{loc.name}</p>
                        <p className="text-[11px] text-gray-400">{loc.city}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {query && !isLoading && suggestions.length === 0 && (
            <div className="text-center py-10">
              <Utensils className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-700 font-semibold">No matches found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching for 'Appitito', 'Barbeque', 'Pizza', 'Burger', or 'Alpha 1'.
              </p>
            </div>
          )}

          {/* DISHES LIST */}
          {dishSuggestions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-orange-500" />
                Matching Dishes ({dishSuggestions.length})
              </h4>
              <div className="space-y-2">
                {dishSuggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.slug || item.restaurantId) {
                        onSelectRestaurant(item.slug || item.restaurantId!);
                        onClose();
                      }
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50/50 border border-gray-100 hover:border-orange-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-orange-600">
                            {item.title}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                      </div>
                    </div>

                    {item.dish && (
                      <button
                        onClick={(e) => handleAddDishDirectly(item.dish!, e)}
                        className="ml-2 shrink-0 flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-orange-500 text-orange-600 hover:text-white border border-orange-300 rounded-lg text-xs font-bold shadow-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        ADD
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESTAURANTS LIST */}
          {restoSuggestions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-orange-500" />
                Matching Restaurants ({restoSuggestions.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {restoSuggestions.map((resto) => (
                  <div
                    key={resto.id}
                    onClick={() => {
                      onSelectRestaurant(resto.slug || resto.id);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 border border-gray-100 hover:border-orange-200 transition-all cursor-pointer group"
                  >
                    {resto.image && (
                      <img
                        src={resto.image}
                        alt={resto.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate group-hover:text-orange-600">
                        {resto.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{resto.subtitle}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-600">
                        {resto.rating && (
                          <span className="flex items-center gap-0.5 font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                            <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                            {resto.rating}
                          </span>
                        )}
                        {resto.deliveryTimeMins && (
                          <span className="flex items-center gap-0.5 text-gray-500">
                            <Clock className="w-3 h-3" />
                            {resto.deliveryTimeMins}m
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LOCALITIES LIST */}
          {localitySuggestions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                Areas & Hubs
              </h4>
              <div className="space-y-1.5">
                {localitySuggestions.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      const [locality, city] = loc.title.split(',').map((s) => s.trim());
                      selectLocality(locality, city || 'Greater Noida');
                      onSelectLocality(locality, city || 'Greater Noida');
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50 border border-gray-100 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{loc.title}</p>
                      <p className="text-xs text-gray-500">{loc.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
