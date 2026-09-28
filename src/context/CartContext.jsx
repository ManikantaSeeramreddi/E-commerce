import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchUserCart, syncUserCart } from '../services/api';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Load persistent cart from MongoDB when user or admin logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCart()
        .then((items) => {
          if (Array.isArray(items)) setCartItems(items);
        })
        .catch(() => {});
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user]);

  const addToCart = (product) => {
    const pid = product.id || product._id;
    setCartItems((prev) => {
      const existing = prev.find((item) => (item.id || item._id || item.productId) === pid);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          (item.id || item._id || item.productId) === pid
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { ...product, productId: pid, quantity: 1 }];
      }
      if (isAuthenticated) syncUserCart(updated);
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => (item.id || item._id || item.productId) !== id);
      if (isAuthenticated) syncUserCart(updated);
      return updated;
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        (item.id || item._id || item.productId) === id ? { ...item, quantity } : item
      );
      if (isAuthenticated) syncUserCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (isAuthenticated) syncUserCart([]);
  };

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems: cartItems.reduce((sum, i) => sum + i.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
export default CartProvider;