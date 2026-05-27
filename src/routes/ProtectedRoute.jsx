import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { MarketplaceContext } from '../context/MarketplaceContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useContext(MarketplaceContext);
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login, saving the location they tried to access
    return <Navigate to="/login" state={{ from: location, requireAuth: true }} replace />;
  }

  return children;
}
