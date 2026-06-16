import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { fetchProductById, getErrorMessage } from '../lib/api';
import CustomSelect from '../components/CustomSelect';
import { CATEGORY_SELECT_OPTIONS } from '../lib/marketplaceCategories';
import { HiOutlineArrowLeft, HiOutlinePhoto, HiOutlinePlusCircle } from 'react-icons/hi2';

const STATUS_OPTIONS = [
  { value: 'Disponible', label: 'Disponible' },
  { value: 'Réservé', label: 'Réservé' },
  { value: 'Indisponible', label: 'Indisponible' },
];

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, products, myProducts, isLoadingProducts, addProduct, editProduct } = useContext(MarketplaceContext);
  const isEditMode = !!id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Électronique');
  const [whatsapp, setWhatsapp] = useState(currentUser ? currentUser.whatsapp : '22890112233');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState('Disponible');
  const [isNew, setIsNew] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEditMode);

  const populateForm = (product) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setCategory(product.category);
    setWhatsapp(product.whatsapp);
    setImagePreview(product.imageUrl || product.image);
    setStatus(product.status);
    setIsNew(product.isNew);
  };

  useEffect(() => {
    if (!isEditMode) return;

    let isMounted = true;

    async function loadForEdit() {
      if (isLoadingProducts) return;

      setIsLoadingProduct(true);
      let product = products.find((p) => p.id === Number(id))
        || myProducts.find((p) => p.id === Number(id));

      if (!product) {
        try {
          product = await fetchProductById(id);
        } catch {
          if (isMounted) navigate('/dashboard');
          return;
        }
      }

      if (!isMounted) return;

      if (!currentUser || product.vendeurId !== currentUser.id) {
        navigate('/dashboard');
        return;
      }

      populateForm(product);
      setIsLoadingProduct(false);
    }

    if (currentUser) {
      loadForEdit();
    }

    return () => { isMounted = false; };
  }, [id, isEditMode, products, myProducts, isLoadingProducts, currentUser, navigate]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !whatsapp) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (!isEditMode && !imageFile) {
      setError('Veuillez sélectionner une image pour le produit.');
      return;
    }

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      whatsapp,
      status,
      isNew,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await editProduct(id, productData, imageFile);
      } else {
        await addProduct(productData, imageFile);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoadingProduct) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto my-12">
        <p className="text-sm text-slate-400 font-semibold">Chargement du produit...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-100 hover:border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition-all"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          <span>Annuler</span>
        </Link>
        <span className="text-slate-400 font-semibold text-xs">/</span>
        <span className="text-slate-600 font-extrabold text-xs">
          {isEditMode ? 'Modifier la référence' : 'Publier une nouvelle offre'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {isEditMode ? 'Formulaire de modification' : 'Enregistrer une nouvelle référence B2B'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Les produits sont enregistrés sur le serveur avec votre compte vendeur.</p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Nom du produit <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  placeholder="Ex: iPhone 15 Pro Max 256GB"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Catégorie</label>
                <CustomSelect
                  value={category}
                  onChange={setCategory}
                  options={CATEGORY_SELECT_OPTIONS}
                  variant="form"
                  menuAlign="left"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Prix de vente (FCFA) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => { setPrice(e.target.value); setError(''); }}
                    placeholder="Ex: 850000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">FCFA</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Description commerciale <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setError(''); }}
                rows="4"
                placeholder="Renseignez les détails techniques, le lot minimal de vente..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Numéro WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => { setWhatsapp(e.target.value); setError(''); }}
                  placeholder="Ex: 22890112233"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Statut de disponibilité</label>
                <CustomSelect
                  value={status}
                  onChange={setStatus}
                  options={STATUS_OPTIONS}
                  variant="form"
                  menuAlign="left"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Image produit (JPEG, PNG — max 10 Mo) {!isEditMode && <span className="text-rose-500">*</span>}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full text-xs font-semibold text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-50 file:text-brand-700 file:font-bold"
              />
              {isEditMode && (
                <p className="text-[10px] text-slate-400 font-semibold">Laissez vide pour conserver l'image actuelle.</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-50">
              <input
                type="checkbox"
                id="isNew"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="rounded border-slate-300 text-brand-500 focus:ring-brand-500 h-4 w-4 cursor-pointer"
              />
              <label htmlFor="isNew" className="text-xs font-bold text-slate-600 cursor-pointer">
                Définir comme un "Nouveau" produit
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Link
                to="/dashboard"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-xl text-xs transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5"
              >
                <HiOutlinePlusCircle className="w-4.5 h-4.5" />
                <span>
                  {isSubmitting
                    ? 'Enregistrement...'
                    : isEditMode
                      ? 'Enregistrer les modifications'
                      : 'Publier le produit'}
                </span>
              </button>
            </div>
          </form>
        </div>

        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-slate-900/5 p-4 rounded-2xl border border-slate-200/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center mb-3">Prévisualisation</span>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 tracking-tight line-clamp-1">
                    {name || 'Nom du produit'}
                  </h3>
                  <span className="text-[9px] font-semibold text-slate-400 mt-0.5 inline-block uppercase tracking-wider">
                    {category}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center p-3 h-36 bg-slate-50/50 relative">
                {isNew && (
                  <span className="absolute top-2 left-3 bg-brand-100 text-brand-700 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Nouveau
                  </span>
                )}
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-full max-w-[85%] object-contain" />
                ) : (
                  <div className="text-slate-300 flex flex-col items-center justify-center">
                    <HiOutlinePhoto className="w-8 h-8" />
                    <span className="text-[8px] font-bold">Aucune image</span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-slate-50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="bg-slate-100 text-slate-600 text-[8px] font-bold px-2 py-0.5 rounded uppercase">
                    {status}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-sm font-extrabold text-slate-900 mt-1">
                    {price ? `${new Intl.NumberFormat('fr-FR').format(price)} FCFA` : '0 FCFA'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
