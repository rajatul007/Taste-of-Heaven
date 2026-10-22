import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, MenuItem, Restaurant, SelectedOption, Coupon } from '../types';
import { api } from '../services/api';

interface ConflictItemPayload {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  restaurant: Restaurant;
}

interface CartContextType {
  items: CartItem[];
  restaurant: Restaurant | null;
  restaurantId: string | null;
  addItem: (menuItem: MenuItem, quantity: number, selectedOptions: SelectedOption[], restaurant: Restaurant) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  tip: number;
  setTip: (tip: number) => void;
  grandTotal: number;
  coupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  conflictItem: ConflictItemPayload | null;
  resolveConflict: (proceedWithReplace: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('foodrush_cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [restaurant, setRestaurant] = useState<Restaurant | null>(() => {
    const saved = localStorage.getItem('foodrush_cart_restaurant');
    return saved ? JSON.parse(saved) : null;
  });

  const [coupon, setCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('foodrush_cart_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [couponError, setCouponError] = useState<string | null>(null);
  const [tip, setTip] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [conflictItem, setConflictItem] = useState<ConflictItemPayload | null>(null);

  useEffect(() => {
    localStorage.setItem('foodrush_cart_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('foodrush_cart_restaurant', JSON.stringify(restaurant));
  }, [restaurant]);

  useEffect(() => {
    localStorage.setItem('foodrush_cart_coupon', JSON.stringify(coupon));
  }, [coupon]);

  const restaurantId = restaurant ? restaurant.id : null;

  const itemCount = useMemo(() => {
    return items.reduce((sum, it) => sum + it.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + it.itemTotal, 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (items.length === 0 || !restaurant) return 0;
    if (coupon?.code === 'FREEDEL') return 0;
    if (subtotal >= 499) return 0; // Free delivery over ₹499
    return restaurant.deliveryFee || 29;
  }, [items, restaurant, subtotal, coupon]);

  const tax = useMemo(() => {
    return Math.round(subtotal * 0.05); // 5% GST
  }, [subtotal]);

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (subtotal < coupon.minOrderAmount) return 0;

    if (coupon.discountAmount) {
      return coupon.discountAmount;
    }
    if (coupon.discountPercentage) {
      let calc = Math.round((subtotal * coupon.discountPercentage) / 100);
      if (coupon.maxDiscount && calc > coupon.maxDiscount) {
        calc = coupon.maxDiscount;
      }
      return calc;
    }
    return 0;
  }, [coupon, subtotal]);

  const grandTotal = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal + deliveryFee + tax + tip - discount);
  }, [items, subtotal, deliveryFee, tax, tip, discount]);

  const executeAddItem = (
    menuItem: MenuItem,
    quantity: number,
    selectedOptions: SelectedOption[],
    targetRestaurant: Restaurant
  ) => {
    // Generate unique cart item hash based on dish ID + chosen options
    const optionKey = selectedOptions
      .map((o) => `${o.groupId}:${o.optionId}`)
      .sort()
      .join('|');
    const cartItemId = optionKey ? `${menuItem.id}_${optionKey}` : menuItem.id;

    let singleItemPrice = menuItem.price;
    selectedOptions.forEach((opt) => {
      singleItemPrice += opt.price;
    });

    setItems((prev) => {
      const existingIdx = prev.findIndex((it) => it.cartItemId === cartItemId);
      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + quantity;
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: newQty,
          itemTotal: singleItemPrice * newQty,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            menuItem,
            quantity,
            selectedOptions,
            itemTotal: singleItemPrice * quantity,
          },
        ];
      }
    });

    setRestaurant(targetRestaurant);
  };

  const addItem = (
    menuItem: MenuItem,
    quantity: number,
    selectedOptions: SelectedOption[],
    targetRestaurant: Restaurant
  ) => {
    // Check if adding from a different restaurant
    if (restaurant && restaurant.id !== targetRestaurant.id && items.length > 0) {
      setConflictItem({ menuItem, quantity, selectedOptions, restaurant: targetRestaurant });
      return;
    }

    executeAddItem(menuItem, quantity, selectedOptions, targetRestaurant);
  };

  const resolveConflict = (proceedWithReplace: boolean) => {
    if (proceedWithReplace && conflictItem) {
      setItems([]);
      setCoupon(null);
      executeAddItem(
        conflictItem.menuItem,
        conflictItem.quantity,
        conflictItem.selectedOptions,
        conflictItem.restaurant
      );
    }
    setConflictItem(null);
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(cartItemId);
      return;
    }

    setItems((prev) =>
      prev.map((it) => {
        if (it.cartItemId !== cartItemId) return it;
        const singlePrice = it.itemTotal / it.quantity;
        return {
          ...it,
          quantity: newQty,
          itemTotal: singlePrice * newQty,
        };
      })
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => {
      const remaining = prev.filter((it) => it.cartItemId !== cartItemId);
      if (remaining.length === 0) {
        setRestaurant(null);
        setCoupon(null);
      }
      return remaining;
    });
  };

  const clearCart = () => {
    setItems([]);
    setRestaurant(null);
    setCoupon(null);
    setTip(0);
    setCouponError(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    try {
      const res = await api.applyCoupon(code, subtotal);
      if (res.valid && res.coupon) {
        setCoupon(res.coupon);
        return true;
      } else {
        setCouponError(res.message || 'Invalid coupon');
        return false;
      }
    } catch (err: any) {
      setCouponError(err.message || 'Failed to apply coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurant,
        restaurantId,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        tax,
        discount,
        tip,
        setTip,
        grandTotal,
        coupon,
        couponError,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        conflictItem,
        resolveConflict,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
