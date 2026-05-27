import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { HiOutlineArrowLeft, HiOutlinePhoto, HiOutlineCurrencyDollar, HiOutlinePlusCircle } from 'react-icons/hi2';

// Standard high-quality presets for demonstration
const IMAGE_PRESETS = [
  { name: "iPhone 15", url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80" },
  { name: "MacBook", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80" },
  { name: "Samsung S24", url: "https://images.unsplash.com/photo-1711802497672-00fe85c7bb5e?w=600&auto=format&fit=crop&q=80" },
  { name: "iPad Pro", url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80" },
  { name: "Dell XPS", url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80" },
  { name: "QuietComfort", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" },
];

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, products, addProduct, editProduct } = useContext(MarketplaceContext);
  const isEditMode = !!id;

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Téléphones');
  const [brand, setBrand] = useState('Apple');
  const [whatsapp, setWhatsapp] = useState(currentUser ? currentUser.whatsapp : '22890112233');
  const [image, setImage] = useState(IMAGE_PRESETS[0].url);
  const [status, setStatus] = useState('Disponible');
  const [isNew, setIsNew] = useState(true);
  const [error, setError] = useState('');

  // Load existing product in edit mode
  useEffect(() => {
    if (isEditMode) {
      const product = products.find(p => p.id === Number(id));
      if (product) {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setBrand(product.brand);
        setWhatsapp(product.whatsapp);
        setImage(product.image);
        setStatus(product.status);
        setIsNew(product.isNew);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, isEditMode, products, navigate]);

  // Security check: Redirect if no user logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !price || !whatsapp) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      brand,
      whatsapp,
      image,
      status,
      isNew
    };

    if (isEditMode) {
      editProduct(id, productData);
    } else {
      addProduct(productData);
    }

    navigate('/dashboard');
  };

  return (
    <div className="space-y-6">
      
      {/* Back Header */}
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

      {/* Main Grid: Form Left + Visual Preview Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FORM PANEL (8 columns on desktop) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {isEditMode ? 'Formulaire de modification' : 'Enregistrer une nouvelle référence B2B'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Tous les produits publiés intègrent immédiatement les filtres de recherche.</p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Row 1: Name and Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nom du produit <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  placeholder="Ex: iPhone 15 Pro Max 256GB"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Marque</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold cursor-pointer"
                >
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Dell">Dell</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="LG">LG</option>
                  <option value="Bose">Bose</option>
                </select>
              </div>
            </div>

            {/* Row 2: Category and Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold cursor-pointer"
                >
                  <option value="Téléphones">Téléphones</option>
                  <option value="Ordinateurs">Ordinateurs</option>
                  <option value="Tablettes">Tablettes</option>
                  <option value="Accessoires">Accessoires</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Prix de vente (FCFA) <span className="text-rose-500">*</span></label>
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

            {/* Description Textarea */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Description commerciale <span className="text-rose-500">*</span></label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setError(''); }}
                rows="4"
                placeholder="Renseignez les détails techniques, le lot minimal de vente, l'état cosmétique, la disponibilité d'une facture..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold resize-none"
              ></textarea>
            </div>

            {/* Row 3: WhatsApp Contact and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Numéro WhatsApp (Togo: 228XXXXXXXX) <span className="text-rose-500">*</span></label>
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
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold cursor-pointer"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Réservé">Réservé</option>
                  <option value="Indisponible">Indisponible</option>
                </select>
              </div>
            </div>

            {/* Preset Image Selection Gallery */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Image produit (Sélectionner un visuel haute qualité)</label>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`h-14 rounded-lg bg-slate-50 border p-1 flex items-center justify-center transition-all ${
                      image === preset.url
                        ? 'border-brand-500 ring-2 ring-brand-100 shadow-sm'
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="max-h-full object-contain" />
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Ou saisir l'URL d'une image personnalisée :</span>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-lg text-[10px] focus:outline-none focus:border-brand-500 focus:bg-white font-semibold"
                />
              </div>
            </div>

            {/* Checkbox: Nouveau produit */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-50">
              <input
                type="checkbox"
                id="isNew"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="rounded border-slate-300 text-brand-500 focus:ring-brand-500 h-4 w-4 cursor-pointer"
              />
              <label htmlFor="isNew" className="text-xs font-bold text-slate-600 cursor-pointer">
                Définir comme un "Nouveau" produit (Afficher le badge de nouveauté)
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Link
                to="/dashboard"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-xl text-xs transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5"
              >
                <HiOutlinePlusCircle className="w-4.5 h-4.5" />
                <span>{isEditMode ? 'Enregistrer les modifications' : 'Publier le produit'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* VISUAL PREVIEW PANEL (4 columns on desktop) */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-slate-900/5 p-4 rounded-2xl border border-slate-200/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center mb-3">Prévisualisation en direct</span>
            
            {/* Mimic a clean Product Card rendering in real time */}
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
                <div className="p-1.5 bg-slate-50 text-slate-300 rounded-lg">
                  ★
                </div>
              </div>

              <div className="flex items-center justify-center p-3 h-36 bg-slate-50/50 relative">
                {isNew && (
                  <span className="absolute top-2 left-3 bg-brand-100 text-brand-700 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Nouveau
                  </span>
                )}
                {image ? (
                  <img src={image} alt="Preview" className="max-h-full max-w-[85%] object-contain" />
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
                  <span className="text-[9px] text-slate-400 font-semibold">0 vues</span>
                </div>
                <div className="h-[1px] bg-slate-100/70"></div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Tarif</span>
                    <span className="text-sm font-extrabold text-slate-900 mt-1">
                      {price ? new Intl.NumberFormat('fr-FR').format(price) + ' FCFA' : '0 FCFA'}
                    </span>
                  </div>
                  <span className="bg-slate-900 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg">Détails</span>
                </div>
              </div>
            </div>
            
          </div>
        </aside>

      </div>
    </div>
  );
}
