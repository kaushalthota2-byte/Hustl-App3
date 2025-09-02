import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Cart, CartItem, MenuItem, OrderSummary } from '@/types/restaurant';
import { getRestaurantById } from '@/lib/restaurantData';

interface CartContextType {
  cart: Cart | null;
  addToCart: (item: CartItem) => void;
  updateCartItem: (itemId: string, updates: Partial<CartItem>) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  setRestaurant: (restaurantId: string) => boolean; // Returns false if cart conflict
  getOrderSummary: () => OrderSummary | null;
  hasCartConflict: (restaurantId: string) => boolean;
}

const TAX_RATE = 0.07; // 7% flat tax
const FEES = 0; // $0 fees

function calculateCartTotals(items: CartItem[]): { subtotal: number; tax: number; fees: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const fees = FEES;
  const total = subtotal + tax + fees;
  
  return { subtotal, tax, fees, total };
}

function calculateLineTotal(menuItem: MenuItem, selectedModifiers: Record<string, string[]>, quantity: number): number {
  let total = menuItem.basePrice;
  
  // Add modifier prices
  menuItem.modifierGroups.forEach(group => {
    const selectedOptions = selectedModifiers[group.id] || [];
    selectedOptions.forEach(optionId => {
      const option = group.options.find(opt => opt.id === optionId);
      if (option) {
        total += option.price;
      }
    });
  });
  
  return Math.round(total * quantity * 100); // Convert to cents
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);

  const hasCartConflict = (restaurantId: string): boolean => {
    return cart !== null && cart.restaurantId !== restaurantId && cart.items.length > 0;
  };

  const setRestaurant = (restaurantId: string): boolean => {
    if (hasCartConflict(restaurantId)) {
      return false; // Caller should handle conflict
    }

    const restaurant = getRestaurantById(restaurantId);
    if (!restaurant) return false;

    if (!cart || cart.restaurantId !== restaurantId) {
      const totals = calculateCartTotals([]);
      setCart({
        restaurantId,
        restaurantName: restaurant.name,
        items: [],
        ...totals,
      });
    }

    return true;
  };

  const addToCart = (item: CartItem) => {
    if (!cart) return;

    setCart(prev => {
      if (!prev) return null;

      const newItems = [...prev.items, item];
      const totals = calculateCartTotals(newItems);

      return {
        ...prev,
        items: newItems,
        ...totals,
      };
    });
  };

  const updateCartItem = (itemId: string, updates: Partial<CartItem>) => {
    if (!cart) return;

    setCart(prev => {
      if (!prev) return null;

      const newItems = prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, ...updates };
          
          // Recalculate line total if quantity or modifiers changed
          if (updates.quantity !== undefined || updates.selectedModifiers !== undefined) {
            updatedItem.lineTotal = calculateLineTotal(
              updatedItem.menuItem,
              updatedItem.selectedModifiers,
              updatedItem.quantity
            );
          }
          
          return updatedItem;
        }
        return item;
      });

      const totals = calculateCartTotals(newItems);

      return {
        ...prev,
        items: newItems,
        ...totals,
      };
    });
  };

  const removeFromCart = (itemId: string) => {
    if (!cart) return;

    setCart(prev => {
      if (!prev) return null;

      const newItems = prev.items.filter(item => item.id !== itemId);
      const totals = calculateCartTotals(newItems);

      return {
        ...prev,
        items: newItems,
        ...totals,
      };
    });
  };

  const clearCart = () => {
    if (!cart) return;

    setCart(prev => {
      if (!prev) return null;

      const totals = calculateCartTotals([]);
      return {
        ...prev,
        items: [],
        ...totals,
      };
    });
  };

  const getOrderSummary = (): OrderSummary | null => {
    if (!cart || cart.items.length === 0) return null;

    return {
      restaurantId: cart.restaurantId,
      restaurantName: cart.restaurantName,
      items: cart.items.map(item => ({
        id: item.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        selectedOptions: getSelectedOptionsText(item),
        notes: item.notes,
        lineTotal: item.lineTotal,
      })),
      totals: {
        subtotal: cart.subtotal,
        tax: cart.tax,
        fees: cart.fees,
        total: cart.total,
      },
    };
  };

  const getSelectedOptionsText = (item: CartItem): string[] => {
    const options: string[] = [];
    
    item.menuItem.modifierGroups.forEach(group => {
      const selectedOptions = item.selectedModifiers[group.id] || [];
      selectedOptions.forEach(optionId => {
        const option = group.options.find(opt => opt.id === optionId);
        if (option) {
          options.push(option.name);
        }
      });
    });
    
    return options;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      setRestaurant,
      getOrderSummary,
      hasCartConflict,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}