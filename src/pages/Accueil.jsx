import React, { useContext, useState, useMemo } from 'react';
import { MarketplaceContext } from '../context/MarketplaceContext';
import ProductCard from '../components/ProductCard';
import CustomSelect from '../components/CustomSelect';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineArrowsUpDown, HiOutlineXMark } from 'react-icons/hi2';
import { FILTER_CATEGORIES } from '../lib/marketplaceCategories';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Trier par : Recommandé' },
  { value: 'price-asc', label: 'Prix : Croissant' },
  { value: 'price-desc', label: 'Prix : Décroissant' },
  { value: 'views', label: 'Plus de vues' },
];

export default function Accueil() {
  const { products, isLoadingProducts } = useContext(MarketplaceContext);

  // --- Filtering & Sorting States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  
  // Mobile filter sidebar toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = FILTER_CATEGORIES;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Toutes');
    setMinPrice(0);
    setMaxPrice(3000000);
    setOnlyNew(false);
    setOnlyAvailable(false);
    setSortBy('recommended');
  };

  // --- Filtered and Sorted Products ---
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Search text matching
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Category matching
        const matchesCategory = selectedCategory === 'Toutes' || product.category === selectedCategory;

        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        
        // "Nouveau" status matching
        const matchesNew = !onlyNew || product.isNew;
        
        // Available status matching
        const matchesAvailable = !onlyAvailable || product.status === 'Disponible';

        return matchesSearch && matchesCategory && matchesPrice && matchesNew && matchesAvailable;
      })
      .sort((a, b) => {
        // Sorting logic
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'views') return b.views - a.views;
        return b.id - a.id; // "recommended" / newest listings first
      });
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice, onlyNew, onlyAvailable, sortBy]);

  // Active filter chips list helper
  const activeChips = useMemo(() => {
    const chips = [];
    if (selectedCategory !== 'Toutes') {
      chips.push({ id: 'category', label: selectedCategory, onRemove: () => setSelectedCategory('Toutes') });
    }
    if (onlyNew) {
      chips.push({ id: 'new', label: 'Nouveautés', onRemove: () => setOnlyNew(false) });
    }
    if (onlyAvailable) {
      chips.push({ id: 'available', label: 'Disponibles', onRemove: () => setOnlyAvailable(false) });
    }
    if (minPrice > 0 || maxPrice < 3000000) {
      chips.push({ 
        id: 'price', 
        label: `${new Intl.NumberFormat('fr-FR').format(minPrice)}F - ${new Intl.NumberFormat('fr-FR').format(maxPrice)}F`, 
        onRemove: () => { setMinPrice(0); setMaxPrice(3000000); } 
      });
    }
    return chips;
  }, [selectedCategory, onlyNew, onlyAvailable, minPrice, maxPrice]);

  return (
    <div className="space-y-6">
      
      {/* 1. Sub-Header Toolbar (tabs, search bar, sort & filter buttons) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Toggle tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto self-stretch md:self-auto shrink-0 justify-center">
          <button
            onClick={() => setSelectedCategory('Toutes')}
            className={`flex-1 md:flex-none px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              selectedCategory === 'Toutes'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tous les Produits
          </button>
          <button
            onClick={() => setSelectedCategory('Électronique')}
            className={`flex-1 md:flex-none px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              selectedCategory === 'Électronique'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Électronique
          </button>
        </div>

        {/* Dynamic Search Bar */}
        <div className="relative w-full md:max-w-md">
          <HiOutlineMagnifyingGlass className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un produit, une catégorie..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none rounded-xl text-sm transition-all shadow-inner-sm text-slate-700 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <HiOutlineXMark className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter and Sort buttons */}
        <div className="flex gap-3 w-full md:w-auto self-stretch md:self-auto">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all md:hidden"
          >
            <HiOutlineFunnel className="w-4 h-4" />
            <span>Filtres</span>
          </button>

          <CustomSelect
            value={sortBy}
            onChange={setSortBy}
            options={SORT_OPTIONS}
            icon={HiOutlineArrowsUpDown}
            className="w-full md:w-auto"
          />
        </div>
      </div>

      {/* 2. Main Page Layout (Sidebar filters + Products grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Sidebar Filters (desktop layout) */}
        <aside className={`lg:block ${showMobileFilters ? 'block fixed inset-0 z-40 bg-white p-6 overflow-y-auto custom-scroll' : 'hidden'} lg:static lg:bg-transparent lg:p-0`}>
          {showMobileFilters && (
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-lg font-extrabold text-slate-900">Filtres avancés</h2>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-lg bg-slate-100 text-slate-600"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            
            {/* Filter Header with Reset option */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">Filtrer</h3>
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
              >
                Réinitialiser
              </button>
            </div>

            {/* Switch Toggles */}
            <div className="space-y-4">
              {/* Toggle 1: Free Test Drive style -> Nouveau */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Nouveautés uniquement</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={onlyNew}
                    onChange={(e) => setOnlyNew(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                </label>
              </div>

              {/* Toggle 2: Disponible uniquement */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Disponible uniquement</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                </label>
              </div>
            </div>

            {/* Categories buttons */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Catégorie</span>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scroll pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-50 border-brand-200 text-brand-700 font-bold'
                        : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider with visual density histogram (as in mockup image) */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Budget (FCFA)</span>
              
              {/* Density Bar Chart (Pure visual fidelity matching mockup image) */}
              <div className="slider-bar-chart">
                <div className="slider-bar-item h-1/5 active"></div>
                <div className="slider-bar-item h-2/5 active"></div>
                <div className="slider-bar-item h-4/5 active"></div>
                <div className="slider-bar-item h-3/5 active"></div>
                <div className="slider-bar-item h-5/5 active"></div>
                <div className="slider-bar-item h-2/5 active"></div>
                <div className="slider-bar-item h-3/5 active"></div>
                <div className="slider-bar-item h-1/5"></div>
                <div className="slider-bar-item h-2/5"></div>
                <div className="slider-bar-item h-1/5"></div>
              </div>

              {/* Slider Input */}
              <div className="pt-2">
                <input
                  type="range"
                  min="0"
                  max="3000000"
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer appearance-none"
                />
              </div>

              {/* Custom dual min-max textboxes */}
              <div className="flex items-center space-x-2 pt-2">
                <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-lg p-2 text-center">
                  <span className="text-[9px] block text-slate-400 uppercase font-bold">Min</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-bold text-slate-700 text-center focus:outline-none"
                  />
                </div>
                <span className="text-slate-400 font-bold text-xs">-</span>
                <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-lg p-2 text-center">
                  <span className="text-[9px] block text-slate-400 uppercase font-bold">Max</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-bold text-slate-700 text-center focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {showMobileFilters && (
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs mt-4"
              >
                Appliquer les filtres
              </button>
            )}

          </div>
        </aside>

        {/* RIGHT COLUMN: Results Header, Chips, & Product Grid */}
        <section className="lg:col-span-3 space-y-4">
          
          {/* Grid info header (X cars found, chips tags list) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            
            {/* Found Products Count and Badge indicators */}
            <div className="flex justify-between items-center">
              <h2 className="text-slate-800 text-base sm:text-lg font-bold tracking-tight">
                {filteredProducts.length} {filteredProducts.length > 1 ? 'Produits Trouvés' : 'Produit Trouvé'}
              </h2>
              
              <div className="hidden sm:flex space-x-2">
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Livraison Gratuite</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Vendeurs Vérifiés</span>
              </div>
            </div>

            {/* Active filter chips tags */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center pt-2">
                <span className="text-xs font-semibold text-slate-400">Actifs :</span>
                {activeChips.map((chip) => (
                  <span
                    key={chip.id}
                    className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                    onClick={chip.onRemove}
                  >
                    <span>{chip.label}</span>
                    <HiOutlineXMark className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Product cards grid */}
          {isLoadingProducts ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-400 font-semibold">Chargement des produits...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl mb-4">
                🔍
              </div>
              <h3 className="font-extrabold text-slate-800 text-base mb-1">Aucun produit ne correspond à vos filtres</h3>
              <p className="text-xs text-slate-400 max-w-sm">Essayer de modifier votre budget, changer de catégorie ou réinitialiser tous vos filtres de recherche.</p>
              <button
                onClick={resetFilters}
                className="mt-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}

        </section>

      </div>
    </div>
  );
}
