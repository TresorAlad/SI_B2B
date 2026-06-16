import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { fetchAdminStats, getErrorMessage } from '../lib/api';
import {
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineEye,
  HiOutlineTag,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';

function StatCard({ icon: Icon, label, value, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${accents[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { currentUser } = useContext(MarketplaceContext);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-400 text-sm font-semibold">
        Chargement des statistiques...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto my-12 p-8 bg-rose-50 border border-rose-100 rounded-2xl text-center">
        <p className="text-rose-600 text-sm font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineShieldCheck className="w-5 h-5 text-brand-500" />
            <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Tableau de bord système
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Bienvenue, {currentUser?.name} — vue d'ensemble de la plateforme B2B.Hunt
          </p>
        </div>
        <Link
          to="/"
          className="text-xs font-bold text-slate-500 hover:text-brand-500 transition-colors"
        >
          ← Retour à l'accueil
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={HiOutlineUsers} label="Utilisateurs" value={stats.totalUsers} accent="brand" />
        <StatCard icon={HiOutlineUsers} label="Vendeurs" value={stats.totalVendeurs} accent="emerald" />
        <StatCard icon={HiOutlineShieldCheck} label="Administrateurs" value={stats.totalAdmins} accent="slate" />
        <StatCard icon={HiOutlineShoppingBag} label="Produits" value={stats.totalProduits} accent="amber" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={HiOutlineEye} label="Vues totales" value={stats.totalVues} accent="brand" />
        <StatCard icon={HiOutlineTag} label="Catégories" value={stats.totalCategories} accent="slate" />
        <StatCard icon={HiOutlineChartBar} label="Mis en avant" value={stats.produitsMisEnAvant} accent="emerald" />
        <StatCard icon={HiOutlineShoppingBag} label="Disponibles" value={stats.produitsDisponibles} accent="emerald" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-800 mb-4 uppercase tracking-wider">
          Répartition des produits par statut
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="text-xs font-bold text-emerald-700">Disponibles</span>
            <span className="text-lg font-extrabold text-emerald-800">{stats.produitsDisponibles}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
            <span className="text-xs font-bold text-amber-700">Réservés</span>
            <span className="text-lg font-extrabold text-amber-800">{stats.produitsReserves}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-100">
            <span className="text-xs font-bold text-rose-700">Indisponibles</span>
            <span className="text-lg font-extrabold text-rose-800">{stats.produitsIndisponibles}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 font-medium">
        Compte admin par défaut : <strong className="text-slate-700">admin@b2b.hunt</strong> /{' '}
        <strong className="text-slate-700">Admin@2026</strong> (configurable via variables d'environnement)
      </div>
    </div>
  );
}
