import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';

export default function Login() {
  const { login } = useContext(MarketplaceContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where the user was trying to go before being intercepted by ProtectedRoute
  const from = location.state?.from?.pathname || '/dashboard';
  const showAuthRequiredAlert = location.state?.requireAuth;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    
    // Simulate login
    login(email, password);
    navigate(from, { replace: true });
  };

  // Quick Demo account login for convenient evaluation
  const handleQuickLogin = () => {
    login('jean@togo.tg', 'password123');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 sm:py-12 relative overflow-hidden">
      {/* Decorative gradient glowing spheres in background */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md glassmorphism p-8 rounded-3xl shadow-xl border border-white/40">
        
        {/* Header brand info */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-bold text-xl mx-auto shadow-lg shadow-brand-500/20 mb-3">
            B
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Ravi de vous revoir</h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">Connectez-vous pour gérer vos offres professionnelles</p>
        </div>

        {/* Dynamic Premium Auth Redirection Alert */}
        {showAuthRequiredAlert && (
          <div className="mb-4 p-3.5 bg-brand-50/80 border border-brand-200/50 text-brand-800 rounded-xl text-xs font-semibold flex items-start space-x-2.5 shadow-sm animate-pulse">
            <span className="shrink-0 text-base leading-none">🔒</span>
            <span className="leading-relaxed">
              <strong className="block font-bold text-brand-900 mb-0.5">Connexion requise</strong>
              Pour publier des articles, modifier vos tarifs ou accéder à votre espace vendeur, veuillez d'abord vous connecter ou créer un compte.
            </span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Adresse email</label>
            <div className="relative">
              <HiOutlineEnvelope className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="nom@entreprise.com"
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
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs pt-1">
            <label className="flex items-center space-x-1.5 font-semibold text-slate-500 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
              <span>Se souvenir</span>
            </label>
            <a href="#" className="font-bold text-brand-500 hover:text-brand-600">Mot de passe oublié ?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all transform active:scale-98"
          >
            Se connecter
          </button>
        </form>

        {/* Separator line */}
        <div className="my-6 flex items-center justify-between">
          <div className="h-[1px] bg-slate-200 w-full"></div>
          <span className="text-[10px] text-slate-400 font-bold uppercase px-3 shrink-0">Ou</span>
          <div className="h-[1px] bg-slate-200 w-full"></div>
        </div>

        {/* Dynamic Demo Quick Login button */}
        <button
          onClick={handleQuickLogin}
          type="button"
          className="w-full bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold py-2.5 rounded-xl text-xs border border-brand-200/60 shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <span>Accès rapide : Compte Vendeur Démo</span>
        </button>

        {/* Bottom register link */}
        <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
          Pas encore de compte ?{' '}
          <Link to="/register" state={{ from: location.state?.from, requireAuth: showAuthRequiredAlert }} className="text-brand-500 hover:text-brand-600 font-bold">
            Créer un compte
          </Link>
        </p>

      </div>
    </div>
  );
}
