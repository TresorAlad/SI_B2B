import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MarketplaceContext } from '../context/MarketplaceContext';
import CustomSelect from '../components/CustomSelect';
import PasswordInput from '../components/PasswordInput';
import { COUNTRY_SELECT_OPTIONS, SEXE_OPTIONS, getCountryByCode } from '../lib/countries';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
} from 'react-icons/hi2';

export default function Register() {
  const { register } = useContext(MarketplaceContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sexe, setSexe] = useState('MASCULIN');
  const [paysCode, setPaysCode] = useState('TG');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';
  const showAuthRequiredAlert = location.state?.requireAuth;
  const selectedCountry = getCountryByCode(paysCode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !telephone || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    const phoneDigits = telephone.replace(/\D/g, '');
    if (phoneDigits.length < 6) {
      setError('Numéro de téléphone invalide.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      name,
      email,
      sexe,
      paysCode,
      telephone,
      password,
      confirmPassword,
    });
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Échec de l'inscription.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 sm:py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md glassmorphism p-8 rounded-3xl shadow-xl border border-white/40">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-bold text-xl mx-auto shadow-lg shadow-brand-500/20 mb-3">
            B
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Rejoindre B2B.Hunt</h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">Créez votre compte vendeur professionnel</p>
        </div>

        {showAuthRequiredAlert && (
          <div className="mb-4 p-3.5 bg-brand-50/80 border border-brand-200/50 text-brand-800 rounded-xl text-xs font-semibold flex items-start space-x-2.5 shadow-sm">
            <span className="shrink-0 text-base leading-none">🔒</span>
            <span className="leading-relaxed">
              <strong className="block font-bold text-brand-900 mb-0.5">Inscription requise</strong>
              Pour publier des articles ou accéder à votre espace vendeur, créez d'abord un compte.
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Nom complet
            </label>
            <div className="relative">
              <HiOutlineUser className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Ex: Koffi Mensah"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Adresse email
            </label>
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Sexe
            </label>
            <CustomSelect
              variant="form"
              menuAlign="left"
              value={sexe}
              onChange={setSexe}
              options={SEXE_OPTIONS}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Pays
            </label>
            <CustomSelect
              variant="form"
              menuAlign="left"
              value={paysCode}
              onChange={setPaysCode}
              options={COUNTRY_SELECT_OPTIONS}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Numéro de téléphone
            </label>
            <div className="flex gap-2">
              <div className="shrink-0 px-3 py-2.5 bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-600">
                +{selectedCountry.dial}
              </div>
              <div className="relative flex-1">
                <HiOutlinePhone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => { setTelephone(e.target.value); setError(''); }}
                  placeholder="90 00 00 00"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Mot de passe
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Minimum 6 caractères"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Confirmer le mot de passe
            </label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
              placeholder="Répétez le mot de passe"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all transform active:scale-98 mt-1"
          >
            {isSubmitting ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
          Déjà inscrit ?{' '}
          <Link
            to="/login"
            state={{ from: location.state?.from, requireAuth: showAuthRequiredAlert }}
            className="text-brand-500 hover:text-brand-600 font-bold"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
