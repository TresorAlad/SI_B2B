import React, { useState } from 'react';
import { HiOutlineShare, HiOutlineLink, HiOutlineCheck } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import { getProductShareUrl } from '../lib/productSlug';

const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

export default function ShareButton({ product, className = '' }) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (!product) return null;

  const shareUrl = getProductShareUrl(product);
  const formatPrice = (value) => new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  const shareText = `Découvre "${product.name}" sur B2B.Hunt — ${formatPrice(product.price)}`;

  const handleShareClick = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: shareUrl,
        });
        setShowMenu(false);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }
    setShowMenu((prev) => !prev);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
    setShowMenu(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleShareClick}
        aria-label="Partager cette annonce"
        className="p-2 rounded-lg transition-all duration-300 transform active:scale-95 focus:outline-none bg-white text-slate-500 hover:text-brand-500 hover:bg-brand-50 border border-slate-100 hover:border-brand-100 shadow-sm"
      >
        <HiOutlineShare className="w-5 h-5" />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-56 bg-white rounded-xl border border-slate-100 shadow-lg overflow-hidden animate-fade-in">
            <div className="px-3 py-2 border-b border-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Partager l'annonce</p>
              <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5" title={shareUrl}>
                {shareUrl.replace(window.location.origin, '')}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {copied ? (
                <HiOutlineCheck className="w-4 h-4 text-emerald-500" />
              ) : (
                <HiOutlineLink className="w-4 h-4 text-slate-400" />
              )}
              <span>{copied ? 'Lien copié !' : 'Copier le lien'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-50"
            >
              <FaWhatsapp className="w-4 h-4 text-emerald-500" />
              <span>Envoyer à un ami</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
