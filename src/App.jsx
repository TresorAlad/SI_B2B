import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MarketplaceProvider } from './context/MarketplaceContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <MarketplaceProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </MarketplaceProvider>
  );
}
