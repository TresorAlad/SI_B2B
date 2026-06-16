import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { MarketplaceContext } from '../context/MarketplaceContext';

export default function AdminRoute({ children }) {
  const { currentUser } = useContext(MarketplaceContext);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location, requireAuth: true }} replace />;
  }

  if (currentUser.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}
