import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';

export default function Register() {
  const { register } = useContext(MarketplaceContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Determine redirection location
  const from = location.state?.from?.pathname || '/dashboard';
  const showAuthRequiredAlert = location.state?.requireAuth;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    
    // Simulate register
    register(name, email, password);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 sm:py-12 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md glassmorphism p-8 rounded-3xl shadow-xl border border-white/40">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-bold text-xl mx-auto shadow-lg shadow-brand-500/20 mb-3">
            B
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Rejoindre B2B.Hunt</h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">Commencez à référencer vos produits en quelques instants</p>
        </div>

        {/* Dynamic Premium Auth Redirection Alert */}
        {showAuthRequiredAlert && (
          <div className="mb-4 p-3.5 bg-brand-50/80 border border-brand-200/50 text-brand-800 rounded-xl text-xs font-semibold flex items-start space-x-2.5 shadow-sm animate-pulse">
            <span className="shrink-0 text-base leading-none">🔒</span>
            <span className="leading-relaxed">
              <strong className="block font-bold text-brand-900 mb-0.5">Inscription requise</strong>
              Pour publier des articles, modifier vos tarifs ou accéder à votre espace vendeur, veuillez d'abord créer un compte.
            </span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nom complet / Entreprise</label>
            <div className="relative">
              <HiOutlineUser className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Ex: Lomé Import Sarl"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Adresse email pro</label>
            <div className="relative">
              <HiOutlineEnvelope className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="contact@entreprise.tg"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Mot de passe</label>
            <div className="relative">
              <HiOutlineLockClosed className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Minimum 6 caractères"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs pt-1">
            <input type="checkbox" required className="rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
            <span className="font-semibold text-slate-500">J'accepte les conditions de vente B2B</span>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all transform active:scale-98"
          >
            Créer mon compte
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
          Déjà inscrit ?{' '}
          <Link to="/login" state={{ from: location.state?.from, requireAuth: showAuthRequiredAlert }} className="text-brand-500 hover:text-brand-600 font-bold">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
}
