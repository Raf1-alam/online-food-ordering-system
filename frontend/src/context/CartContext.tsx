import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Use AuthContext directly to avoid circular dependency issues if hooks get messy
  const { user } = useContext(AuthContext) || {}; 

  // Fetch cart when user logs in and is a customer
  useEffect(() => {
    if (user && user.role === 'CUSTOMER') {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (menuItemId, quantity = 1) => {
    try {
      const res = await api.post('/cart/items', { menuItemId, quantity });
      setCart(res.data.data);
      return true;
    } catch (error) {
      console.error("Failed to add item to cart", error);
      throw error;
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      setCart(res.data.data);
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart');
      setCart(res.data.data);
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/items/${itemId}`, { quantity });
      setCart(res.data.data);
    } catch (error) {
      console.error("Failed to update item quantity", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addItem, removeItem, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
