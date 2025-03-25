
// src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], totalAmount: 0 };
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.items.findIndex(
        item => item.id === product.id
      );

      let newItems;

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item to cart
        newItems = [
          ...prevCart.items,
          {
            ...product,
            quantity
          }
        ];
      }

      // Calculate new total
      const totalAmount = newItems.reduce(
        (total, item) => total + (item.discountPrice || item.price) * item.quantity,
        0
      );

      return {
        items: newItems,
        totalAmount
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== productId);
      
      // Calculate new total
      const totalAmount = newItems.reduce(
        (total, item) => total + (item.discountPrice || item.price) * item.quantity,
        0
      );

      return {
        items: newItems,
        totalAmount
      };
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      // Calculate new total
      const totalAmount = newItems.reduce(
        (total, item) => total + (item.discountPrice || item.price) * item.quantity,
        0
      );

      return {
        items: newItems,
        totalAmount
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalAmount: 0 });
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
