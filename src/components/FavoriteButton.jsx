import React, { useContext, useState } from 'react';
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi2';
import { MarketplaceContext } from '../context/MarketplaceContext';

export default function FavoriteButton({ productId, className = "" }) {
  const { isFavorite, toggleFavorite } = useContext(MarketplaceContext);
  const [isLoading, setIsLoading] = useState(false);
  const active = isFavorite(productId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    setIsLoading(true);
    try {
      await toggleFavorite(productId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`p-2 rounded-lg transition-all duration-300 transform active:scale-95 focus:outline-none disabled:opacity-60 ${
        active 
          ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
          : 'bg-white text-brand-500 hover:bg-brand-50 border border-slate-100 hover:border-brand-100 shadow-sm'
      } ${className}`}
    >
      {active ? (
        <HiBookmark className="w-5 h-5 animate-jump" />
      ) : (
        <HiOutlineBookmark className="w-5 h-5" />
      )}
    </button>
  );
}
