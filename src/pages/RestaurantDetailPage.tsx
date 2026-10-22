import React, { useState, useEffect } from 'react';
import {
  Star,
  Clock,
  MapPin,
  Navigation2,
  ExternalLink,
  Search,
  CheckCircle2,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Plus,
  Minus,
  AlertCircle,
  Phone,
  Calendar,
  Tag,
  UtensilsCrossed,
} from 'lucide-react';
import { Restaurant, MenuItem } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { ItemCustomizationModal } from '../components/ItemCustomizationModal';
import { DineoutBookingModal } from '../components/DineoutBookingModal';

interface RestaurantDetailPageProps {
  slugOrId: string;
  onBack: () => void;
  onSelectAnotherRestaurant: (slugOrId: string) => void;
}

export const RestaurantDetailPage: React.FC<RestaurantDetailPageProps> = ({
  slugOrId,
  onBack,
  onSelectAnotherRestaurant,
}) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Menu filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vegOnly, setVegOnly] = useState(false);

  // Customization modal
  const [customizingDish, setCustomizingDish] = useState<MenuItem | null>(null);
  const [isDineoutModalOpen, setIsDineoutModalOpen] = useState(false);

  const { items, addItem, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    async function loadRestaurant() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getRestaurantByIdOrSlug(slugOrId);
        setRestaurant(data.restaurant);
        setMenuItems(data.menuItems);
      } catch (err: any) {
        setError(err.message || 'Restaurant not found');
      } finally {
        setIsLoading(false);
      }
    }
    loadRestaurant();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slugOrId]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-3xl" />
        <div className="h-8 bg-gray-200 rounded-sm w-1/3" />
        <div className="h-4 bg-gray-200 rounded-sm w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Restaurant Not Found</h2>
        <p className="text-xs text-gray-500">
          The requested restaurant could not be located in our directory.
        </p>
        <button
          onClick={onBack}
          className="py-2.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors"
        >
          Return to All Restaurants
        </button>
      </div>
    );
  }

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (vegOnly && !item.isVeg) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = ['all', ...restaurant.categories];

  const handleDishAdd = (dish: MenuItem) => {
    if (dish.optionGroups && dish.optionGroups.length > 0) {
      setCustomizingDish(dish);
    } else {
      addItem(dish, 1, [], restaurant);
    }
  };

  const getDishCartQuantity = (dishId: string) => {
    const found = items.filter((it) => it.menuItem.id === dishId);
    return found.reduce((sum, it) => sum + it.quantity, 0);
  };

  const shareRestaurant = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${restaurant.name} on Taste of Heaven`,
          text: `Check out ${restaurant.name} located in ${restaurant.locality}, ${restaurant.city}!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Restaurant link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pb-28">
      {/* Top Navigation & Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Restaurants</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={shareRestaurant}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              title="Share restaurant"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* RESTAURANT HERO CARD */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-md">
          {/* Cover Photo */}
          <div className="relative h-60 sm:h-72 w-full bg-gray-100">
            <img
              src={restaurant.coverImage}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            {/* Badges on Cover */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {restaurant.discountOffer && (
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold text-xs px-3 py-1 rounded-lg shadow-md uppercase tracking-wider">
                  {restaurant.discountOffer}
                </span>
              )}
              {restaurant.verificationStatus === 'verified' && (
                <span className="bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-white text-emerald-600" />
                  Verified Kitchen ({restaurant.lastVerifiedDate})
                </span>
              )}
            </div>

            {/* Bottom Meta Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h1 className="text-2xl sm:text-4xl font-black drop-shadow-md">
                {restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-200 mt-1 line-clamp-1">
                {restaurant.description}
              </p>
            </div>
          </div>

          {/* Details & Action Bar */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pb-4 border-b border-gray-100">
              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px]">Rating</p>
                <div className="flex items-center gap-1 mt-0.5 font-bold text-gray-900 text-sm">
                  <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                  <span>{restaurant.rating}</span>
                  <span className="text-gray-400 font-normal">({restaurant.reviewCount}+ reviews)</span>
                </div>
              </div>

              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px]">Delivery Time</p>
                <div className="flex items-center gap-1 mt-0.5 font-bold text-gray-900 text-sm">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>{restaurant.deliveryTimeMins} mins</span>
                  <span className="text-gray-400 font-normal">({restaurant.distanceKm} km)</span>
                </div>
              </div>

              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px]">Cost For Two</p>
                <p className="mt-0.5 font-bold text-gray-900 text-sm">
                  ₹{restaurant.costForTwo} for two
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px]">Hours & Contact</p>
                <p className="mt-0.5 font-semibold text-gray-800 truncate">
                  {restaurant.openingHours}
                </p>
              </div>
            </div>

            {/* Location & Directions Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">
                    {restaurant.locality}, {restaurant.city}
                  </p>
                  <p className="text-gray-500">{restaurant.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Book Table Dineout Button */}
                {(restaurant.tableBookingAvailable || restaurant.hasDineout) && (
                  <button
                    onClick={() => setIsDineoutModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-black shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Table ({restaurant.dineoutDiscount ? restaurant.dineoutDiscount.replace('with Dineout', '') : '25% OFF'})
                  </button>
                )}

                {/* Official Google Maps Search link */}
                <a
                  href={restaurant.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-200"
                >
                  <Navigation2 className="w-3.5 h-3.5 text-blue-500" />
                  Directions (Google Maps)
                </a>

                {/* External Official Website Link */}
                {restaurant.officialWebsite && (
                  <a
                    href={restaurant.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    <span>Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Dineout Discount Highlight Banner */}
            {(restaurant.hasDineout || restaurant.tableBookingAvailable) && (
              <div className="p-3.5 bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 dark:from-stone-800 dark:to-stone-850 border border-orange-200 dark:border-orange-900/60 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-orange-900 dark:text-orange-300">
                      Taste of Heaven Dineout Offer
                    </span>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      {restaurant.dineoutDiscount || 'FLAT 25% OFF on total dine-in bill and live buffet'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDineoutModalOpen(true)}
                  className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 cursor-pointer"
                >
                  Reserve Now
                </button>
              </div>
            )}

            {/* Barbeque Nation Notice (Buffet vs Delivery) */}
            {restaurant.slug === 'barbeque-nation-greater-noida' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Barbeque Nation Dining Modes:</p>
                  <p className="text-amber-800 mt-0.5">
                    • <strong>Home Delivery:</strong> Order signature Barbeque-in-a-Box meal boxes below via Taste of Heaven.<br />
                    • <strong>Dine-in Buffet Table Reservations:</strong> Book through Taste of Heaven Dineout or call {restaurant.contactPhone}.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MENU SEARCH & FILTERS BAR */}
        <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search within Menu */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g. Pizza, Shakes, Whopper)..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500"
              />
            </div>

            {/* Veg Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  vegOnly
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Pure Veg Only
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Dishes' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* MENU ITEMS GRID */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center justify-between">
            <span>
              {selectedCategory === 'all' ? 'Full Menu' : selectedCategory} ({filteredItems.length})
            </span>
            <span className="text-xs text-gray-400 font-normal">
              Freshly prepared to order
            </span>
          </h2>

          {filteredItems.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-gray-200/60 p-6 space-y-2">
              <p className="text-sm font-bold text-gray-800">No dishes match your filter</p>
              <p className="text-xs text-gray-500">Try clearing the search or category filter</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setVegOnly(false);
                }}
                className="mt-2 py-1.5 px-3 bg-orange-600 text-white rounded-lg text-xs font-bold"
              >
                Reset Menu Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((dish) => {
                const currentQty = getDishCartQuantity(dish.id);

                return (
                  <div
                    key={dish.id}
                    className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 transition-all shadow-xs flex justify-between gap-4 group"
                  >
                    {/* Dish Info */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        {/* Veg / Non-Veg Indicator */}
                        <div
                          className={`w-4 h-4 border flex items-center justify-center rounded-xs ${
                            dish.isVeg ? 'border-emerald-600' : 'border-red-600'
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                          />
                        </div>

                        {dish.isBestseller && (
                          <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-sm uppercase">
                            Bestseller
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {dish.name}
                      </h3>

                      <p className="text-sm font-extrabold text-gray-900">₹{dish.price}</p>

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>

                      {dish.rating && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                          <span>{dish.rating}</span>
                          <span className="text-gray-400 font-normal">({dish.reviewCount})</span>
                        </div>
                      )}
                    </div>

                    {/* Dish Image & Add Button */}
                    <div className="flex flex-col items-center justify-between shrink-0 w-28 sm:w-32">
                      <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="mt-2 w-full">
                        {currentQty > 0 ? (
                          <div className="flex items-center justify-between bg-orange-600 text-white rounded-xl px-2 py-1 font-bold text-xs shadow-xs">
                            <button
                              onClick={() => {
                                const matchingCartItem = items.find(
                                  (it) => it.menuItem.id === dish.id
                                );
                                if (matchingCartItem) {
                                  updateQuantity(
                                    matchingCartItem.cartItemId,
                                    matchingCartItem.quantity - 1
                                  );
                                }
                              }}
                              className="hover:scale-110 transition-transform"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span>{currentQty}</span>
                            <button
                              onClick={() => handleDishAdd(dish)}
                              className="hover:scale-110 transition-transform"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDishAdd(dish)}
                            className="w-full py-1.5 px-3 bg-white hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-300 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            ADD
                          </button>
                        )}
                        {dish.optionGroups && dish.optionGroups.length > 0 && (
                          <p className="text-[10px] text-gray-400 text-center mt-0.5">
                            Customizable
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Item Customization Modal */}
      {customizingDish && (
        <ItemCustomizationModal
          item={customizingDish}
          restaurant={restaurant}
          onClose={() => setCustomizingDish(null)}
        />
      )}

      {/* Dineout Table Booking Modal */}
      {isDineoutModalOpen && (
        <DineoutBookingModal
          restaurant={restaurant}
          isOpen={isDineoutModalOpen}
          onClose={() => setIsDineoutModalOpen(false)}
        />
      )}
    </div>
  );
};
