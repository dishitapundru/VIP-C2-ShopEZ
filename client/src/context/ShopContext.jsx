import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const requireAuth = () => {
    if (!user) {
      toast.error('Please login or register to use this feature.');
      // Optional: you can force navigation using window.location here
      // window.location.href = '/login';
      return false;
    }
    return true;
  };

  const addToCart = (product, quantity = 1) => {
    if (!requireAuth()) return false;
    
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    toast.success('Added to Cart!');
    return true;
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
    toast.success('Removed from Cart!');
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart(prev => prev.map(item => item._id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    if (!requireAuth()) return;
    
    setWishlist(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        toast.success('Removed from Wishlist!');
        return prev.filter(item => item._id !== product._id);
      } else {
        toast.success('Added to Wishlist!');
        return [...prev, product];
      }
    });
  };

  return (
    <ShopContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      wishlist, toggleWishlist
    }}>
      {children}
    </ShopContext.Provider>
  );
};
