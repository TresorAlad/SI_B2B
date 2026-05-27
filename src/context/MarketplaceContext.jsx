import React, { createContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/products';

export const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  // --- Authentication State ---
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('b2b_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });


  // --- Products State ---
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('b2b_products');
    if (savedProducts) return JSON.parse(savedProducts);
    
    localStorage.setItem('b2b_products', JSON.stringify(initialProducts));
    return initialProducts;
  });

  // --- Favorites State ---
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('b2b_favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('b2b_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('b2b_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('b2b_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('b2b_user');
    }
  }, [currentUser]);

  // --- Auth Actions ---
  const login = (email, password) => {
    // Simple mock authentication
    const user = {
      name: email.split('@')[0].toUpperCase(),
      email: email,
      whatsapp: "22890000000"
    };
    setCurrentUser(user);
    return true;
  };

  const register = (name, email, password) => {
    const user = {
      name: name,
      email: email,
      whatsapp: "22890000000"
    };
    setCurrentUser(user);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // --- Product CRUD Actions ---
  const addProduct = (newProductData) => {
    const newProduct = {
      id: Date.now(), // Generate a unique ID
      views: 0,
      datePublished: new Date().toISOString().split('T')[0],
      sellerName: currentUser ? currentUser.name : "Vendeur Externe",
      ...newProductData,
      price: Number(newProductData.price)
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const editProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => {
      if (p.id === Number(id)) {
        return { 
          ...p, 
          ...updatedData, 
          price: Number(updatedData.price) 
        };
      }
      return p;
    }));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== Number(id)));
    // Also remove from favorites if deleted
    setFavorites(prev => prev.filter(favId => favId !== Number(id)));
  };

  const incrementViews = (id) => {
    setProducts(prev => prev.map(p => {
      if (p.id === Number(id)) {
        return { ...p, views: p.views + 1 };
      }
      return p;
    }));
  };

  // --- Favorite Actions ---
  const toggleFavorite = (id) => {
    const numId = Number(id);
    setFavorites(prev => {
      if (prev.includes(numId)) {
        return prev.filter(favId => favId !== numId);
      } else {
        return [...prev, numId];
      }
    });
  };

  const isFavorite = (id) => {
    return favorites.includes(Number(id));
  };

  return (
    <MarketplaceContext.Provider value={{
      currentUser,
      products,
      favorites,
      login,
      register,
      logout,
      addProduct,
      editProduct,
      deleteProduct,
      incrementViews,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};
