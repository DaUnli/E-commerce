import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { cartApi } from "../api/cartApi";
import type { Cart } from "../types/index";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
}

export const CartContext = createContext<CartContextType>(
  {} as CartContextType,
);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await cartApi.getCart();
      setCart(res.data.cart);
    } catch (error) {
      console.error("Error fetching cart", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      await cartApi.addToCart(productId, quantity);
      await fetchCart();
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await cartApi.updateQuantity(productId, quantity);
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await cartApi.removeFromCart(productId);
      await fetchCart();
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
