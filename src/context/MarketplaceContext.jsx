import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  registerUser,
  loginUser,
  fetchCurrentUser,
  fetchProducts,
  fetchVendeurProducts,
  fetchFavorites,
  createProduct,
  updateProduct,
  deleteProductApi,
  incrementProductViews,
  toggleFavoriteApi,
  checkIsFavorite,
  getErrorMessage,
} from '../lib/api';
import { buildProductFormData } from '../lib/productMapper';

export const MarketplaceContext = createContext();

function loadStoredUser() {
  const savedUser = localStorage.getItem('b2b_user');
  const token = localStorage.getItem('b2b_token');
  if (savedUser && token) {
    return { user: JSON.parse(savedUser), token };
  }
  return { user: null, token: null };
}

export const MarketplaceProvider = ({ children }) => {
  const stored = loadStoredUser();
  const [currentUser, setCurrentUser] = useState(stored.user);
  const [token, setToken] = useState(stored.token);
  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('b2b_favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingMyProducts, setIsLoadingMyProducts] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [authError, setAuthError] = useState(null);

  const persistAuth = useCallback((authResponse) => {
    const user = { ...authResponse.user, token: authResponse.token };
    localStorage.setItem('b2b_token', authResponse.token);
    localStorage.setItem('b2b_user', JSON.stringify(user));
    setToken(authResponse.token);
    setCurrentUser(user);
    return user;
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('b2b_token');
    localStorage.removeItem('b2b_user');
    setToken(null);
    setCurrentUser(null);
    setMyProducts([]);
    setFavoriteProducts([]);
  }, []);

  const refreshProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erreur chargement produits:', getErrorMessage(error));
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const refreshMyProducts = useCallback(async () => {
    if (!currentUser?.id) {
      setMyProducts([]);
      return;
    }
    setIsLoadingMyProducts(true);
    try {
      const data = await fetchVendeurProducts(currentUser.id);
      setMyProducts(data);
    } catch (error) {
      console.error('Erreur chargement catalogue vendeur:', getErrorMessage(error));
    } finally {
      setIsLoadingMyProducts(false);
    }
  }, [currentUser?.id]);

  const refreshFavorites = useCallback(async () => {
    if (!token) return;
    setIsLoadingFavorites(true);
    try {
      const data = await fetchFavorites();
      setFavoriteProducts(data);
      setFavorites(data.map((p) => p.id));
    } catch (error) {
      console.error('Erreur chargement favoris:', getErrorMessage(error));
    } finally {
      setIsLoadingFavorites(false);
    }
  }, [token]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    if (!token) return;
    fetchCurrentUser()
      .then((user) => {
        const merged = { ...user, token };
        setCurrentUser(merged);
        localStorage.setItem('b2b_user', JSON.stringify(merged));
      })
      .catch(() => clearAuth());
  }, [token, clearAuth]);

  useEffect(() => {
    if (currentUser?.id) {
      refreshMyProducts();
      refreshFavorites();
    }
  }, [currentUser?.id, refreshMyProducts, refreshFavorites]);

  useEffect(() => {
    if (!token) {
      localStorage.setItem('b2b_favorites', JSON.stringify(favorites));
    }
  }, [favorites, token]);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const authResponse = await loginUser({ email, password });
      persistAuth(authResponse);
      await refreshProducts();
      await refreshFavorites();
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error);
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, whatsapp) => {
    setAuthError(null);
    try {
      const authResponse = await registerUser({ name, email, password, whatsapp });
      persistAuth(authResponse);
      await refreshProducts();
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error);
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    clearAuth();
  };

  const addProduct = async (productData, imageFile) => {
    const formData = buildProductFormData(productData, imageFile);
    const created = await createProduct(formData);
    setProducts((prev) => [created, ...prev]);
    setMyProducts((prev) => [created, ...prev]);
    return created;
  };

  const editProduct = async (id, productData, imageFile) => {
    const formData = buildProductFormData(productData, imageFile);
    const updated = await updateProduct(id, formData);
    setProducts((prev) => prev.map((p) => (p.id === Number(id) ? updated : p)));
    setMyProducts((prev) => prev.map((p) => (p.id === Number(id) ? updated : p)));
    return updated;
  };

  const deleteProduct = async (id) => {
    await deleteProductApi(id);
    setProducts((prev) => prev.filter((p) => p.id !== Number(id)));
    setMyProducts((prev) => prev.filter((p) => p.id !== Number(id)));
    setFavorites((prev) => prev.filter((favId) => favId !== Number(id)));
    setFavoriteProducts((prev) => prev.filter((p) => p.id !== Number(id)));
  };

  const incrementViews = async (id) => {
    try {
      const updated = await incrementProductViews(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === Number(id) ? { ...p, views: updated.views } : p))
      );
    } catch (error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === Number(id) ? { ...p, views: p.views + 1 } : p))
      );
    }
  };

  const toggleFavorite = async (id) => {
    const numId = Number(id);
    if (token) {
      try {
        const added = await toggleFavoriteApi(numId);
        if (added) {
          const product = products.find((p) => p.id === numId);
          setFavorites((prev) => [...prev, numId]);
          if (product) {
            setFavoriteProducts((prev) => [...prev, product]);
          } else {
            await refreshFavorites();
          }
        } else {
          setFavorites((prev) => prev.filter((favId) => favId !== numId));
          setFavoriteProducts((prev) => prev.filter((p) => p.id !== numId));
        }
      } catch (error) {
        console.error('Erreur favori:', getErrorMessage(error));
      }
      return;
    }

    setFavorites((prev) => {
      if (prev.includes(numId)) {
        return prev.filter((favId) => favId !== numId);
      }
      return [...prev, numId];
    });
  };

  const isFavorite = (id) => {
    return favorites.includes(Number(id));
  };

  const syncFavoriteStatus = async (id) => {
    if (!token) return;
    try {
      const isFav = await checkIsFavorite(id);
      setFavorites((prev) => {
        const numId = Number(id);
        if (isFav && !prev.includes(numId)) return [...prev, numId];
        if (!isFav) return prev.filter((favId) => favId !== numId);
        return prev;
      });
    } catch {
      // ignore
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentUser,
        token,
        products,
        myProducts,
        favoriteProducts,
        favorites,
        isLoadingProducts,
        isLoadingMyProducts,
        isLoadingFavorites,
        authError,
        login,
        register,
        logout,
        addProduct,
        editProduct,
        deleteProduct,
        incrementViews,
        toggleFavorite,
        isFavorite,
        syncFavoriteStatus,
        refreshProducts,
        refreshMyProducts,
        refreshFavorites,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
