import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MarketplaceContext } from '../context/MarketplaceContext';
import ProductCard from '../components/ProductCard';
import { HiOutlineHeart, HiOutlineArrowLeft } from 'react-icons/hi2';

export default function Favorites() {
  const { products, favorites } = useContext(MarketplaceContext);

  // Retrieve products marked as favorite
  const favoriteProducts = useMemo(() => {
    return products.filter(p => favorites.includes(p.id));
  }, [products, favorites]);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Mes Coups de Cœur</h1>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Consultez et négociez rapidement vos produits mis en favoris.</p>
        </div>

        <Link
          to="/"
          className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-3.5 rounded-xl transition-all"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          <span>Marketplace</span>
        </Link>
      </div>

      {/* Favorites Grid / Empty State */}
      {favoriteProducts.length > 0 ? (
        <div className="space-y-4">
          <span className="text-xs font-semibold text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm inline-block">
            {favoriteProducts.length} {favoriteProducts.length > 1 ? 'produits sauvegardés' : 'produit sauvegardé'}
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-3xl mb-4 animate-pulse">
            <HiOutlineHeart className="w-8 h-8" />
          </div>
          
          <h3 className="font-extrabold text-slate-800 text-base mb-1">Aucun favori pour l'instant</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-semibold">
            Parcourez la marketplace B2B et ajoutez des produits en favoris pour les retrouver facilement et lancer des négociations rapides.
          </p>

          <Link
            to="/"
            className="mt-6 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md shadow-brand-500/10 transition-all inline-block"
          >
            Découvrir des produits
          </Link>
        </div>
      )}

    </div>
  );
}
