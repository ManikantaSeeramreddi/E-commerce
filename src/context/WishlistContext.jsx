import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useLocalStorage('eshop_wishlist', []);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const isWishlisted = (id) => wishlist.some((item) => (item.id || item._id) === id);

  const toggleWishlist = (product) => {
    const id = product.id || product._id;
    setWishlist((items) => (
      items.some((item) => (item.id || item._id) === id)
        ? items.filter((item) => (item.id || item._id) !== id)
        : [...items, product]
    ));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistOpen, setWishlistOpen, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};

export default WishlistProvider;
