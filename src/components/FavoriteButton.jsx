import React, { useContext } from 'react';
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi';
import { MarketplaceContext } from '../context/MarketplaceContext';

export default function FavoriteButton({ productId, className = "" }) {
  const { isFavorite, toggleFavorite } = useContext(MarketplaceContext);
  const active = isFavorite(productId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`p-2 rounded-lg transition-all duration-300 transform active:scale-95 focus:outline-none ${
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
