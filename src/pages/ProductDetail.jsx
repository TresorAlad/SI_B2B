import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { fetchProductById } from '../lib/api';
import { parseProductIdFromSlug } from '../lib/productSlug';
import ProductStatusBadge from '../components/ProductStatusBadge';
import FavoriteButton from '../components/FavoriteButton';
import ShareButton from '../components/ShareButton';
import { HiOutlineEye, HiOutlineCalendar, HiOutlineArrowLeft, HiOutlineCheckBadge } from 'react-icons/hi2';
import { formatViewsLabel, hasViewedInSession, markViewedInSession } from '../lib/views';
import { FaWhatsapp } from 'react-icons/fa';

export default function ProductDetail() {
  const { id, slug } = useParams();
  const productId = parseProductIdFromSlug(slug || id);
  const navigate = useNavigate();
  const { products, incrementViews, syncFavoriteStatus, token } = useContext(MarketplaceContext);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasIncrementedViews, setHasIncrementedViews] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setIsLoading(true);
      setHasIncrementedViews(false);

      const localProduct = products.find((p) => p.id === productId);
      if (localProduct) {
        if (isMounted) {
          setProduct(localProduct);
          setIsLoading(false);
        }
        return;
      }

      try {
        const fetched = await fetchProductById(productId);
        if (isMounted) setProduct(fetched);
      } catch {
        if (isMounted) setProduct(null);
      }
      if (isMounted) setIsLoading(false);
    }

    if (productId) {
      loadProduct();
    } else {
      setProduct(null);
      setIsLoading(false);
    }
    return () => { isMounted = false; };
  }, [productId]);

  useEffect(() => {
    if (!product || hasIncrementedViews) return;

    const alreadyViewed = hasViewedInSession(product.id);
    if (alreadyViewed) {
      setHasIncrementedViews(true);
      return;
    }

    setHasIncrementedViews(true);
    markViewedInSession(product.id);

    setProduct((prev) => (prev ? { ...prev, views: (prev.views || 0) + 1 } : prev));

    incrementViews(product.id).then((updated) => {
      if (updated) {
        setProduct((prev) => (prev ? { ...prev, views: updated.views } : prev));
      }
    });
  }, [product?.id, hasIncrementedViews, incrementViews]);

  useEffect(() => {
    if (token && product) {
      syncFavoriteStatus(product.id);
    }
  }, [token, product, syncFavoriteStatus]);

  if (isLoading) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto my-12">
        <p className="text-sm text-slate-400 font-semibold">Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto my-12">
        <h3 className="text-xl font-extrabold text-slate-800 mb-2">Produit introuvable</h3>
        <p className="text-sm text-slate-400 mb-6">Le produit que vous recherchez n'existe pas ou a été retiré.</p>
        <Link to="/" className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-5 rounded-xl transition-all inline-block">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const imageSrc = product.imageUrl || product.image;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  };

  const getWhatsAppLink = () => {
    const cleanNumber = (product.whatsapp || '').replace(/\D/g, '');
    if (!cleanNumber) return '#';
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé par votre produit "${product.name}" affiché sur B2B.Hunt au prix de ${formatPrice(product.price)}. Est-il toujours disponible ?`
    );
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-100 hover:border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition-all"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Link to="/" className="hover:text-slate-600">Marketplace</Link>
          <span>/</span>
          <span className="hover:text-slate-600 uppercase tracking-wider">{product.category}</span>
          <span>/</span>
          <span className="text-slate-600 font-bold truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-100 via-slate-50 to-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
          {product.isNew && (
            <span className="absolute top-5 left-6 z-10 bg-brand-500 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md shadow-brand-500/10">
              Nouveau
            </span>
          )}
          
          <div className="absolute top-5 right-6 z-10 flex items-center space-x-2">
            <ShareButton product={product} />
            <FavoriteButton productId={product.id} className="p-3 shadow-md border-0 bg-white/90 hover:bg-white" />
          </div>

          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            
            <div className="flex justify-between items-center flex-wrap gap-2 pb-2">
              <ProductStatusBadge status={product.status} />
              
              <div className="flex items-center space-x-3 text-xs text-slate-400 font-semibold">
                <span className="flex items-center">
                  <HiOutlineEye className="w-4 h-4 mr-1 text-slate-400" />
                  {formatViewsLabel(product.views)}
                </span>
                <span className="flex items-center">
                  <HiOutlineCalendar className="w-4 h-4 mr-1 text-slate-400" />
                  {formatDate(product.datePublished)}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Tarif Professionnel</span>
              <div className="flex items-baseline space-x-1 mt-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{formatPrice(product.price)}</span>
                <span className="text-xs font-bold text-slate-400 uppercase ml-1">Hors taxes</span>
              </div>
            </div>

            <div className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-slate-200 transition-colors">
              <div className="flex items-center space-x-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(product.sellerName)}&background=f1f5f9&color=334155&bold=true`}
                  alt={product.sellerName}
                  className="h-10 w-10 rounded-full border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center">
                    <span>{product.sellerName}</span>
                    <HiOutlineCheckBadge className="w-4 h-4 text-brand-500 ml-1" />
                  </h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Fournisseur certifié B2B.Hunt</span>
                </div>
              </div>
              
              <span className="bg-brand-50 text-brand-600 text-[10px] font-bold px-2 py-0.5 rounded">Pro</span>
            </div>

            <div className="flex gap-3">
              <ShareButton product={product} className="shrink-0" />
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-600/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base cursor-pointer"
              >
                <FaWhatsapp className="w-5.5 h-5.5" />
                <span>Négocier sur WhatsApp</span>
              </a>
            </div>

            <p className="text-[10px] text-slate-400 text-center font-medium">
              Une fois cliqué, vous serez redirigé vers WhatsApp pour échanger directement avec le vendeur.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base border-b border-slate-100 pb-2">Description du produit</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
