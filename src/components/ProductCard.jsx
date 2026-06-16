import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineEye } from 'react-icons/hi2';
import ProductStatusBadge from './ProductStatusBadge';
import FavoriteButton from './FavoriteButton';
import ShareButton from './ShareButton';
import { getProductPath } from '../lib/productSlug';
import { formatViewsLabel } from '../lib/views';

export default function ProductCard({ product }) {
  const { id, name, price, category, views, status, isNew } = product;
  const imageSrc = product.imageUrl || product.image;
  const productPath = getProductPath(product);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full overflow-hidden">
      <div className="p-4 sm:p-5 flex justify-between items-start">
        <div className="pr-4 min-w-0">
          <Link to={productPath} className="hover:text-brand-500 transition-colors">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight line-clamp-1 group-hover:text-brand-500">
              {name}
            </h3>
          </Link>
          <span className="text-xs font-semibold text-slate-400 mt-0.5 inline-block uppercase tracking-wider">
            {category}
          </span>
        </div>
        <div className="flex items-center space-x-1 shrink-0">
          <ShareButton product={product} />
          <FavoriteButton productId={id} />
        </div>
      </div>

      <Link
        to={productPath}
        className="block relative mx-4 mb-1 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-white border border-slate-100 aspect-[4/3]"
      >
        {isNew && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Nouveau
          </span>
        )}
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </Link>

      <div className="p-4 sm:p-5 bg-white flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <ProductStatusBadge status={status} />
          <span className="flex items-center text-xs text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded">
            <HiOutlineEye className="w-3.5 h-3.5 mr-1" />
            {formatViewsLabel(views)}
          </span>
        </div>

        <div className="h-px bg-slate-100 w-full mb-3.5" />

        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Prix</span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
              {formatPrice(price)}
            </span>
          </div>

          <Link
            to={productPath}
            className="flex items-center justify-center bg-slate-900 hover:bg-brand-500 text-white hover:text-white p-2 sm:px-3 sm:py-2 rounded-lg font-bold text-xs transition-all duration-300 shadow-sm"
          >
            <span>Détails</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
