"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, getCart, addToCart, removeFromCart } from "@/lib/ecommerce";
import { createClient } from "@/utils/supabase/client";

type CartContextType = {
  items: CartItem[];
  addItem: (productId: string, size: string, qty?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  total: number;
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setItems(data);
    } catch (e) {
      console.error("Cart fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();

    // Listen for auth changes to re-fetch cart
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchCart();
    });

    return () => subscription.unsubscribe();
  }, []);

  const addItem = async (productId: string, size: string, qty = 1) => {
    await addToCart(productId, size, qty);
    await fetchCart();
  };

  const removeItem = async (itemId: string) => {
    await removeFromCart(itemId);
    await fetchCart();
  };

  const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, total, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
