import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineEye, HiOutlinePhone } from 'react-icons/hi2';
import ProductStatusBadge from './ProductStatusBadge';
import FavoriteButton from './FavoriteButton';

export default function ProductCard({ product }) {
  const { id, name, price, category, views, status, isNew, whatsapp, image } = product;

  // Format currency neatly as FCFA (e.g., 350 000 FCFA)
  const formatPrice = (value) => {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* Card Header (Product title & Category + Favorite button) */}
      <div className="p-4 sm:p-5 flex justify-between items-start">
        <div className="pr-4">
          <Link to={`/product/${id}`} className="hover:text-brand-500 transition-colors">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight line-clamp-1 group-hover:text-brand-500">
              {name}
            </h3>
          </Link>
          <span className="text-xs font-semibold text-slate-400 mt-0.5 inline-block uppercase tracking-wider">
            {category}
          </span>
        </div>
        <FavoriteButton productId={id} />
      </div>

      {/* Card Center: Product Image & New Badge */}
      <Link to={`/product/${id}`} className="flex-1 flex items-center justify-center p-3 relative h-40 sm:h-48 bg-slate-50/50">
        {isNew && (
          <span className="absolute top-2.5 left-4 bg-brand-100 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Nouveau
          </span>
        )}
        <img
          src={image}
          alt={name}
          className="max-h-full max-w-[85%] object-contain transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-500 filter drop-shadow-md"
        />
      </Link>

      {/* Card Footer (Status badge + price, views) */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-50">
        {/* Status and Views Row */}
        <div className="flex justify-between items-center mb-3">
          <ProductStatusBadge status={status} />
          
          <span className="flex items-center text-xs text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded">
            <HiOutlineEye className="w-3.5 h-3.5 mr-1" />
            {views} vues
          </span>
        </div>

        {/* Separator Line */}
        <div className="h-[1px] bg-slate-100/70 w-full mb-3.5"></div>

        {/* Pricing and Action row */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Prix</span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
              {formatPrice(price)}
            </span>
          </div>

          {/* Contact or View Details button */}
          <Link
            to={`/product/${id}`}
            className="flex items-center justify-center bg-slate-900 hover:bg-brand-500 text-white hover:text-white p-2 sm:px-3 sm:py-2 rounded-lg font-bold text-xs transition-all duration-300 shadow-sm"
          >
            <span>Détails</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
