import React, { useContext, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { getErrorMessage } from '../lib/api';
import { getProductPath } from '../lib/productSlug';
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineEye, HiOutlineCircleStack, HiOutlineChartBar, HiOutlineCheckBadge } from 'react-icons/hi2';

export default function Dashboard() {
  const { currentUser, myProducts, isLoadingMyProducts, deleteProduct } = useContext(MarketplaceContext);
  const navigate = useNavigate();
  
  // Local state for delete confirmation modal
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Compute analytics
  const analytics = useMemo(() => {
    if (myProducts.length === 0) return { totalViews: 0, avgPrice: 0 };
    const totalViews = myProducts.reduce((sum, p) => sum + p.views, 0);
    const avgPrice = myProducts.reduce((sum, p) => sum + p.price, 0) / myProducts.length;
    return { totalViews, avgPrice };
  }, [myProducts]);

  const handleDeleteClick = (product, e) => {
    e.preventDefault();
    setDeleteError('');
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    } catch (error) {
      setDeleteError(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-white p-10 sm:p-16 text-center rounded-3xl border border-slate-100 shadow-lg max-w-lg mx-auto my-12 space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-3xl mx-auto">
          🔒
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-800">Espace Restreint</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
            Vous devez être connecté en tant que vendeur professionnel pour accéder à votre tableau de bord commercial.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to="/login" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all">
            Se connecter
          </Link>
          <Link to="/register" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-xl text-xs transition-all">
            Créer un compte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <img
            className="h-14 w-14 rounded-full border-2 border-slate-200"
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=3b82f6&color=fff&bold=true`}
            alt={currentUser.name}
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
              <span>{currentUser.name}</span>
              <HiOutlineCheckBadge className="w-5 h-5 text-brand-500 ml-1.5" />
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Géré par {currentUser.name} • Contact : {currentUser.whatsapp}</p>
          </div>
        </div>

        <Link
          to="/add-product"
          className="flex items-center space-x-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-md shadow-brand-500/10 transition-all transform hover:-translate-y-0.5"
        >
          <HiOutlinePlus className="w-4.5 h-4.5" />
          <span>Nouveau produit</span>
        </Link>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* KPI 1: Active products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
            <HiOutlineCircleStack className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none block">Offres Publiées</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">{myProducts.length}</span>
          </div>
        </div>

        {/* KPI 2: Total views */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <HiOutlineEye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none block">Vues Totales</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">{analytics.totalViews}</span>
          </div>
        </div>

        {/* KPI 3: Average catalog price */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <HiOutlineChartBar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none block">Tarif Moyen Catalog</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">
              {new Intl.NumberFormat('fr-FR').format(Math.round(analytics.avgPrice))} F
            </span>
          </div>
        </div>

      </div>

      {/* Seller products catalog listing */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-base font-extrabold text-slate-800">Catalogue des produits actifs</h2>
          <span className="text-xs font-semibold text-slate-400">{myProducts.length} références</span>
        </div>

        {isLoadingMyProducts ? (
          <div className="py-16 text-center text-sm text-slate-400 font-semibold">
            Chargement de votre catalogue...
          </div>
        ) : myProducts.length > 0 ? (
          <div className="overflow-x-auto custom-scroll">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Produit</th>
                  <th className="px-6 py-3.5">Catégorie</th>
                  <th className="px-6 py-3.5">Prix</th>
                  <th className="px-6 py-3.5">Statut</th>
                  <th className="px-6 py-3.5">Vues</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {myProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Product Cell */}
                    <td className="px-6 py-4 flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                        <img src={product.imageUrl || product.image} alt={product.name} className="max-h-full object-contain" />
                      </div>
                      <Link to={getProductPath(product)} className="font-extrabold text-slate-800 hover:text-brand-500 truncate max-w-[200px]">
                        {product.name}
                      </Link>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-xs uppercase tracking-wider text-slate-400">{product.category}</span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-slate-900">
                      {new Intl.NumberFormat('fr-FR').format(product.price)} FCFA
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        product.status === "Disponible" ? "bg-emerald-50 text-emerald-700" :
                        product.status === "Réservé" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {product.status}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="px-6 py-4 text-slate-400">
                      <span className="flex items-center text-xs">
                        <HiOutlineEye className="w-4 h-4 mr-1 text-slate-300" />
                        {product.views}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/edit-product/${product.id}`)}
                          className="p-1.5 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all"
                          title="Modifier le produit"
                        >
                          <HiOutlinePencilSquare className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(product, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Supprimer le produit"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center flex flex-col items-center justify-center px-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-xl mb-3.5">
              📦
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm mb-0.5">Aucun produit publié</h3>
            <p className="text-xs text-slate-400 max-w-xs mb-5">Vous n'avez pas encore publié de produit sur la plateforme avec votre compte entreprise.</p>
            <Link
              to="/add-product"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow"
            >
              Publier ma première offre
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal (Visual and clean backdrop modal) */}
      {productToDelete && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xl mx-auto">
              ⚠️
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-900">Supprimer le produit ?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Êtes-vous sûr de vouloir retirer définitivement <span className="font-bold text-slate-700">"{productToDelete.name}"</span> ? Cette action est irréversible.
              </p>
              {deleteError && (
                <p className="text-xs text-rose-600 font-semibold pt-1">{deleteError}</p>
              )}
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => { setProductToDelete(null); setDeleteError(''); }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-rose-600/10 transition-colors"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
