import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Import Pages
import Accueil from '../pages/Accueil';
import ProductDetail from '../pages/ProductDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AddEditProduct from '../pages/AddEditProduct';
import Favorites from '../pages/Favorites';

export default function AppRoutes() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <MainLayout>
            <Accueil />
          </MainLayout>
        } 
      />
      
      <Route 
        path="/product/:id" 
        element={
          <MainLayout>
            <ProductDetail />
          </MainLayout>
        } 
      />
      
      <Route 
        path="/login" 
        element={
          <MainLayout>
            <Login />
          </MainLayout>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <MainLayout>
            <Register />
          </MainLayout>
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/add-product" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <AddEditProduct />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/edit-product/:id" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <AddEditProduct />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/favorites" 
        element={
          <MainLayout>
            <Favorites />
          </MainLayout>
        } 
      />
    </Routes>
  );
}
