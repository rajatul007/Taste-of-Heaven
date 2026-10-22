import React from 'react';
import { Home, Search, Percent, History, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
}) => {
  const { itemCount, setIsCartDrawerOpen } = useCart();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/80 px-2 py-2 flex items-center justify-around shadow-lg">
      <button
        onClick={() => onNavigate('/')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
          currentRoute === '/' ? 'text-orange-600' : 'text-gray-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-orange-600"
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>

      <button
        onClick={() => onNavigate('/offers')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
          currentRoute === '/offers' ? 'text-orange-600' : 'text-gray-500'
        }`}
      >
        <Percent className="w-5 h-5" />
        <span>Offers</span>
      </button>

      <button
        onClick={() => onNavigate('/orders')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
          currentRoute === '/orders' ? 'text-orange-600' : 'text-gray-500'
        }`}
      >
        <History className="w-5 h-5" />
        <span>Orders</span>
      </button>

      <button
        onClick={() => setIsCartDrawerOpen(true)}
        className="flex flex-col items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-orange-600 relative"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>
    </nav>
  );
};
