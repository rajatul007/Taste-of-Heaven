import React from 'react';
import { Star, Clock, MapPin, Navigation2, CheckCircle2, ExternalLink, Calendar, Tag, UtensilsCrossed } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (slugOrId: string) => void;
  isDineoutMode?: boolean;
  onBookTable?: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelect,
  isDineoutMode = false,
  onBookTable,
}) => {
  return (
    <div
      onClick={() => onSelect(restaurant.slug || restaurant.id)}
      className="group bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-700 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Image Container with Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-stone-800">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Discount Offer Banner */}
        {isDineoutMode ? (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white font-black text-[11px] px-3 py-1 rounded-lg shadow-lg flex items-center gap-1.5 uppercase tracking-wide">
            <Tag className="w-3 h-3 text-amber-200" />
            {restaurant.dineoutDiscount || 'FLAT 25% OFF'}
          </div>
        ) : (
          restaurant.discountOffer && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
              {restaurant.discountOffer}
            </div>
          )
        )}

        {/* Dineout Table Reservation Tag */}
        {restaurant.tableBookingAvailable && !isDineoutMode && (
          <div className="absolute top-3 right-3 bg-white/95 text-orange-700 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <UtensilsCrossed className="w-3 h-3 text-orange-600" />
            Dineout Available
          </div>
        )}

        {/* Open / Closed Badge */}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
              Currently Closed
            </span>
          </div>
        )}

        {/* Verification Status Badge */}
        {!restaurant.tableBookingAvailable && restaurant.verificationStatus === 'verified' && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
            Verified
          </div>
        )}

        {/* Bottom Image Stats Bar */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold drop-shadow-sm">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>{isDineoutMode ? `${restaurant.distanceKm} km away` : `${restaurant.deliveryTimeMins} mins`}</span>
            <span className="text-white/60">•</span>
            <span>{restaurant.distanceKm} km</span>
          </div>
          <div className="text-white/90">₹{restaurant.costForTwo} for two</div>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-md shrink-0 shadow-xs">
              <Star className="w-3 h-3 fill-white" />
              <span>{restaurant.rating}</span>
            </div>
          </div>

          {/* Cuisines */}
          <p className="text-xs text-gray-500 dark:text-stone-400 line-clamp-1 mt-0.5">
            {restaurant.cuisine.join(', ')}
          </p>

          {/* Locality & Address */}
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-stone-300 mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="font-semibold text-gray-800 dark:text-stone-200">{restaurant.locality}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 dark:text-stone-400 truncate">{restaurant.city}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 border-t border-gray-100 dark:border-stone-800 flex items-center justify-between gap-2">
          {/* Google Maps Search Link */}
          <a
            href={restaurant.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 dark:text-stone-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-stone-800 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-stone-700 transition-colors shrink-0"
            title="Search location on Google Maps"
          >
            <Navigation2 className="w-3.5 h-3.5 text-blue-500" />
            Directions
          </a>

          {/* Dineout Book Table Button or Delivery View Menu */}
          {isDineoutMode && restaurant.tableBookingAvailable ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onBookTable) {
                  onBookTable(restaurant);
                } else {
                  onSelect(restaurant.slug || restaurant.id);
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg transition-all shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Table
            </button>
          ) : restaurant.orderingMode === 'external_official' && restaurant.officialWebsite ? (
            <a
              href={restaurant.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
            >
              Official Site
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <button
              onClick={() => onSelect(restaurant.slug || restaurant.id)}
              className="flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 bg-orange-50 dark:bg-stone-800 hover:bg-orange-600 text-orange-700 dark:text-orange-400 hover:text-white rounded-lg transition-all border border-orange-200 dark:border-stone-700 hover:border-orange-600 shadow-xs cursor-pointer"
            >
              View Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

