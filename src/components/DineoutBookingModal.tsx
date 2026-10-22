import React, { useState } from 'react';
import { Restaurant, TableBooking } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Tag,
  MapPin,
  ExternalLink,
  Sparkles,
  Phone,
  User as UserIcon,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface DineoutBookingModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: (booking: TableBooking) => void;
}

export const DineoutBookingModal: React.FC<DineoutBookingModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const { user } = useAuth();

  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('08:00 PM');
  const [customerName, setCustomerName] = useState<string>(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '+91 98112 34567');
  const [specialRequest, setSpecialRequest] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<TableBooking | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const lunchSlots = ['12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM'];
  const dinnerSlots = ['07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM'];

  // Quick dates (Today, Tomorrow, Day After)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const quickDates = [
    { label: 'Today', date: today.toISOString().split('T')[0] },
    { label: 'Tomorrow', date: tomorrow.toISOString().split('T')[0] },
    {
      label: dayAfter.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      date: dayAfter.toISOString().split('T')[0],
    },
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please enter guest name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      const discount = restaurant.dineoutDiscount || 'FLAT 25% OFF on Dine-in Bill';
      const booking = await api.bookTable({
        restaurantId: restaurant.id,
        customerName,
        customerPhone,
        guestsCount,
        bookingDate: selectedDate,
        timeSlot: selectedSlot,
        discountOffer: discount,
      });

      setConfirmedBooking(booking);
      if (onBookingSuccess) {
        onBookingSuccess(booking);
      }

      // Celebration effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#f59e0b', '#10b981', '#3b82f6'],
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reserve table. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedBooking(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              Taste of Heaven Dineout
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">{restaurant.name}</h2>
            <p className="text-xs text-orange-100 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {restaurant.locality}, {restaurant.city}
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Confirmed View */}
          {confirmedBooking ? (
            <div className="text-center py-4 space-y-6 animate-scale-up">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                  Table Reservation Confirmed
                </span>
                <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-2">
                  Booking #{confirmedBooking.bookingCode}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Show this digital pass at the restaurant reception to claim your table & discount.
                </p>
              </div>

              {/* Dineout Pass Ticket */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-850 border-2 border-dashed border-orange-300 dark:border-orange-800/60 text-left space-y-4">
                <div className="flex items-center justify-between border-b border-orange-200/60 dark:border-stone-700 pb-3">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                    <span className="font-bold text-stone-900 dark:text-white">{confirmedBooking.restaurantName}</span>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 bg-orange-600 text-white font-bold rounded-lg shadow-sm">
                    {confirmedBooking.bookingCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 dark:text-stone-400">Date & Slot</span>
                    <p className="font-bold text-stone-800 dark:text-stone-200 text-sm mt-0.5">
                      {confirmedBooking.bookingDate} • {confirmedBooking.timeSlot}
                    </p>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-stone-400">Guests</span>
                    <p className="font-bold text-stone-800 dark:text-stone-200 text-sm mt-0.5">
                      {confirmedBooking.guestsCount} Persons
                    </p>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-stone-400">Reserved For</span>
                    <p className="font-bold text-stone-800 dark:text-stone-200 text-sm mt-0.5">
                      {confirmedBooking.customerName}
                    </p>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-stone-400">Phone</span>
                    <p className="font-bold text-stone-800 dark:text-stone-200 text-sm mt-0.5">
                      {confirmedBooking.customerPhone}
                    </p>
                  </div>
                </div>

                {/* Applied Discount Tag */}
                <div className="p-3 rounded-xl bg-orange-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-200" />
                    <span className="text-xs font-semibold">Active Dineout Offer:</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-wide bg-white/20 px-2 py-0.5 rounded">
                    {confirmedBooking.discountOffer}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Guaranteed Table
                  </span>
                  <a
                    href={restaurant.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:underline font-medium"
                  >
                    Open in Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3 px-4 rounded-xl font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
                >
                  Done & Back to Taste of Heaven
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleBooking} className="space-y-5">
              {/* Discount Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-rose-500/10 border border-orange-300 dark:border-orange-850 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-extrabold text-orange-700 dark:text-orange-400 tracking-wider">
                    Dineout Table Discount Included
                  </div>
                  <div className="text-sm font-bold text-stone-900 dark:text-white">
                    {restaurant.dineoutDiscount || 'FLAT 25% OFF on total bill & buffet'}
                  </div>
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-orange-600" />
                  Number of Guests
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 6, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestsCount(num)}
                      className={`py-2 rounded-xl font-bold text-sm transition-all border ${
                        guestsCount === num
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/30'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-orange-400'
                      }`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  Select Date
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {quickDates.map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setSelectedDate(d.date)}
                      className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all border ${
                        selectedDate === d.date
                          ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-transparent shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  min={today.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Select Time Slot
                </label>
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">Lunch Slots</div>
                  <div className="flex flex-wrap gap-1.5">
                    {lunchSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                          selectedSlot === slot
                            ? 'bg-orange-600 text-white border-orange-600 font-bold'
                            : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-orange-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 pt-1">Dinner Slots</div>
                  <div className="flex flex-wrap gap-1.5">
                    {dinnerSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                          selectedSlot === slot
                            ? 'bg-orange-600 text-white border-orange-600 font-bold'
                            : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-orange-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1 flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98112 34567"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Special Request */}
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Special Request (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="e.g. Birthday anniversary decoration, quiet corner, baby chair"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Confirming Reservation...'
                  ) : (
                    <>
                      <span>Reserve Table & Lock {restaurant.dineoutDiscount ? restaurant.dineoutDiscount.replace('with Dineout', '') : '25% Discount'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-stone-500 dark:text-stone-400 mt-2">
                  Instant confirmation • No booking fee • Free cancellation
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
