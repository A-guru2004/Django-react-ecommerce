import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], total_items: 0, total_price: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], total_items: 0, total_price: 0 });
      return;
    }
    setCartLoading(true);
    try {
      const res = await axiosClient.get('/store/cart/');
      setCart(res.data);
    } catch {
      setCart({ items: [], total_items: 0, total_price: 0 });
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await axiosClient.post('/store/cart/add/', { product_id: productId, quantity });
    setCart(res.data);
  };

  const updateCartItem = async (itemId, quantity) => {
    const res = await axiosClient.put(`/store/cart/item/${itemId}/`, { quantity });
    setCart(res.data);
  };

  const removeCartItem = async (itemId) => {
    const res = await axiosClient.delete(`/store/cart/item/${itemId}/`);
    setCart(res.data);
  };

  return (
    <CartContext.Provider value={{ cart, cartLoading, fetchCart, addToCart, updateCartItem, removeCartItem }}>
      {children}
    </CartContext.Provider>
  );
};