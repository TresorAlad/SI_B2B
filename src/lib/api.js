import axios from 'axios';
import { mapProduitFromApi } from './productMapper';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:8080');

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('b2b_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getErrorMessage(error) {
  return error.response?.data?.error || error.message || 'Une erreur est survenue';
}

function toFormBody(params) {
  const body = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      body.append(key, value);
    }
  });
  return body;
}

export async function registerUser({ name, email, sexe, paysCode, telephone, password, confirmPassword }) {
  const { data } = await api.post(
    '/api/users/register',
    toFormBody({ name, email, sexe, paysCode, telephone, password, confirmPassword }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return data;
}

export async function loginUser({ email, password }) {
  const { data } = await api.post(
    '/api/users/login',
    toFormBody({ email, password }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/api/users/me');
  return data;
}

export async function fetchProducts() {
  const { data } = await api.get('/api/produits');
  return data.map(mapProduitFromApi);
}

export async function fetchFeaturedProducts() {
  const { data } = await api.get('/api/produits/mis-en-avant');
  return data.map(mapProduitFromApi);
}

export async function fetchProductById(id) {
  const { data } = await api.get(`/api/produits/${id}`);
  return mapProduitFromApi(data);
}

export async function fetchVendeurProducts(vendeurId) {
  const { data } = await api.get(`/api/produits/vendeur/${vendeurId}`);
  return data.map(mapProduitFromApi);
}

export async function fetchCategories() {
  const { data } = await api.get('/api/categories');
  return data;
}

export async function createProduct(formData) {
  const { data } = await api.post('/api/produits', formData);
  return mapProduitFromApi(data);
}

export async function updateProduct(id, formData) {
  const { data } = await api.put(`/api/produits/${id}`, formData);
  return mapProduitFromApi(data);
}

export async function deleteProductApi(id) {
  await api.delete(`/api/produits/${id}`);
}

export async function incrementProductViews(id) {
  const { data } = await api.patch(`/api/produits/${id}/vues`);
  return mapProduitFromApi(data);
}

export async function setProductMisEnAvant(id, misEnAvant) {
  const { data } = await api.patch(`/api/produits/${id}/mis-en-avant`, null, {
    params: { misEnAvant },
  });
  return mapProduitFromApi(data);
}

export async function fetchFavorites() {
  const { data } = await api.get('/api/users/favoris');
  return data.map(mapProduitFromApi);
}

export async function checkIsFavorite(produitId) {
  const { data } = await api.get(`/api/users/favoris/${produitId}`);
  return data.isFavorite;
}

export async function toggleFavoriteApi(produitId) {
  const { data } = await api.post(`/api/users/favoris/${produitId}`);
  return data.added;
}

export async function fetchAdminStats() {
  const { data } = await api.get('/api/admin/stats');
  return data;
}

export { getErrorMessage, API_BASE };
