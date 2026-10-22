import React from 'react';
import {
  UtensilsCrossed,
  MapPin,
  ChevronDown,
  Smartphone,
  ShieldCheck,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
  onSelectLocality?: (locality: string, city: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-24 sm:pb-12 border-t border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* App Download Banner (Swiggy Style) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              For better experience, download the Taste of Heaven app now
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              Get live GPS order tracking, instant dineout discounts, and exclusive app-only coupons.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Google Play Button */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-black hover:bg-stone-800 text-white rounded-xl border border-stone-700 transition-all cursor-pointer">
              <Smartphone className="w-5 h-5 text-orange-500" />
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-wider text-stone-400 font-bold leading-none">GET IT ON</p>
                <p className="text-xs font-black text-white leading-tight">Google Play</p>
              </div>
            </div>
            {/* App Store Button */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-black hover:bg-stone-800 text-white rounded-xl border border-stone-700 transition-all cursor-pointer">
              <Smartphone className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-wider text-stone-400 font-bold leading-none">Download on the</p>
                <p className="text-xs font-black text-white leading-tight">App Store</p>
              </div>
            </div>
          </div>
        </div>

        {/* Swiggy-Style 5 Clean Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-xs text-stone-400">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 text-white flex items-center justify-center shadow-md">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">Taste of Heaven</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-400">
              © 2026 Taste of Heaven Technologies Ltd.<br />
              All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-stone-400 pt-1">
              <span className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:text-white transition-colors cursor-pointer">
                <Instagram className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:text-white transition-colors cursor-pointer">
                <Facebook className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:text-white transition-colors cursor-pointer">
                <Twitter className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:text-white transition-colors cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-stone-400">
              <li><button onClick={() => onNavigate('/')} className="hover:text-white transition-colors">About Us</button></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Taste of Heaven Corporate</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Careers</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Team</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Taste of Heaven One</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Taste of Heaven Instamart</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Taste of Heaven Dineout</span></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-2 text-stone-400">
              <li><button onClick={() => onNavigate('/offers')} className="hover:text-white transition-colors">Help & Support</button></li>
              <li><button onClick={() => onNavigate('/owner')} className="hover:text-orange-400 text-orange-400 font-semibold transition-colors">Partner with Us (Restaurant Owner)</button></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Ride with Us (Rider Partner)</span></li>
              <li><button onClick={() => onNavigate('/admin')} className="hover:text-white transition-colors">Operations Console</button></li>
              <li><button onClick={() => onNavigate('/orders')} className="hover:text-white transition-colors">Track Orders</button></li>
            </ul>
          </div>

          {/* Available in */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Available In</h4>
            <ul className="space-y-2 text-stone-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Greater Noida</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Noida</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Delhi / New Delhi</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Gurugram</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Bengaluru</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Mumbai</span></li>
              <li>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-800 text-[10px] text-stone-300 font-bold hover:border-stone-700 transition-colors cursor-pointer">
                  <span>500+ Cities</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </div>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-stone-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Investor Relations</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>FSSAI Certified Restaurant Network • 100% Safe Packaging & Contactless Delivery</span>
          </div>
          <p>Crafted with love for food lovers across India.</p>
        </div>
      </div>
    </footer>
  );
};
