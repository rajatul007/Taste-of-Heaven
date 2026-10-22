import React, { useState, useEffect } from 'react';
import { LocationProvider, useLocation } from './context/LocationContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { SearchOverlay } from './components/SearchOverlay';
import { LocationModal } from './components/LocationModal';
import { AuthModal } from './components/AuthModal';
import { RestaurantConflictModal } from './components/RestaurantConflictModal';
import { CartDrawer } from './components/CartDrawer';
import { FloatingCartBar } from './components/FloatingCartBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { OffersPage } from './pages/OffersPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [routeParam, setRouteParam] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isLocationModalOpen, setIsLocationModalOpen, selectLocality } = useLocation();

  // Handle route navigation and browser history popstate
  const navigateTo = (path: string, param: string = '') => {
    setCurrentRoute(path);
    setRouteParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let url = path;
    if (param) {
      if (path === '/restaurants') url = `/restaurants/${param}`;
      else if (path === '/order-confirmation') url = `/order-confirmation/${param}`;
      else if (path === '/track') url = `/track/${param}`;
    }
    window.history.pushState({}, '', url);
  };

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/restaurants/')) {
        setCurrentRoute('/restaurants');
        setRouteParam(pathname.replace('/restaurants/', ''));
      } else if (pathname.startsWith('/order-confirmation/')) {
        setCurrentRoute('/order-confirmation');
        setRouteParam(pathname.replace('/order-confirmation/', ''));
      } else if (pathname.startsWith('/track/')) {
        setCurrentRoute('/track');
        setRouteParam(pathname.replace('/track/', ''));
      } else {
        setCurrentRoute(pathname || '/');
        setRouteParam('');
      }
    };

    // Initial check on load
    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut ⌘K or Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-gray-900 selection:bg-orange-500 selection:text-white">
      {/* Sticky Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={(path) => navigateTo(path)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentRoute === '/' && (
          <HomePage
            onSelectRestaurant={(slugOrId) => navigateTo('/restaurants', slugOrId)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onNavigate={(path) => navigateTo(path)}
          />
        )}

        {currentRoute === '/restaurants' && (
          <RestaurantDetailPage
            slugOrId={routeParam || 'appitito'}
            onBack={() => navigateTo('/')}
            onSelectAnotherRestaurant={(slugOrId) => navigateTo('/restaurants', slugOrId)}
          />
        )}

        {currentRoute === '/checkout' && (
          <CheckoutPage
            onBack={() => navigateTo('/')}
            onOrderSuccess={(orderId) => navigateTo('/order-confirmation', orderId)}
          />
        )}

        {currentRoute === '/order-confirmation' && (
          <OrderConfirmationPage
            orderId={routeParam || 'FR-98214'}
            onTrackOrder={(orderId) => navigateTo('/track', orderId)}
            onContinueShopping={() => navigateTo('/')}
          />
        )}

        {currentRoute === '/track' && (
          <OrderTrackingPage
            orderId={routeParam || 'ord-101'}
            onBack={() => navigateTo('/orders')}
            onExploreMore={() => navigateTo('/')}
          />
        )}

        {currentRoute === '/orders' && (
          <OrderHistoryPage
            onTrackOrder={(orderId) => navigateTo('/track', orderId)}
            onExploreRestaurants={() => navigateTo('/')}
          />
        )}

        {currentRoute === '/profile' && (
          <UserProfilePage
            onBack={() => navigateTo('/')}
            onSelectRestaurant={(slugOrId) => navigateTo('/restaurants', slugOrId)}
          />
        )}

        {currentRoute === '/offers' && (
          <OffersPage
            onBack={() => navigateTo('/')}
            onExploreRestaurants={() => navigateTo('/')}
          />
        )}

        {currentRoute === '/owner' && (
          <OwnerDashboardPage onBack={() => navigateTo('/')} />
        )}

        {currentRoute === '/admin' && (
          <AdminDashboardPage onBack={() => navigateTo('/')} />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectRestaurant={(slugOrId) => navigateTo('/restaurants', slugOrId)}
        onSelectLocality={(locality, city) => {
          selectLocality(locality, city);
          navigateTo('/');
        }}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocality={(locality, city) => {
          selectLocality(locality, city);
          navigateTo('/');
        }}
      />

      <AuthModal />
      <RestaurantConflictModal />
      <CartDrawer
        onCheckout={() => navigateTo('/checkout')}
        onExploreRestaurants={() => navigateTo('/')}
      />

      {/* Floating Bottom Cart Bar (Swiggy Style) */}
      {currentRoute !== '/checkout' && currentRoute !== '/order-confirmation' && (
        <FloatingCartBar onViewCart={() => navigateTo('/checkout')} />
      )}

      {/* Mobile Navigation Bar */}
      <MobileBottomNav
        currentRoute={currentRoute}
        onNavigate={(path) => navigateTo(path)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Footer */}
      <Footer
        onNavigate={(path) => navigateTo(path)}
        onSelectLocality={(locality, city) => {
          selectLocality(locality, city);
          navigateTo('/');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LocationProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </LocationProvider>
  );
}
