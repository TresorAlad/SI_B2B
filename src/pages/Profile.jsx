import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketplaceContext } from '../context/MarketplaceContext';
import CustomSelect from '../components/CustomSelect';
import PasswordInput from '../components/PasswordInput';
import { COUNTRY_SELECT_OPTIONS, getCountryByCode } from '../lib/countries';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineTrash,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';

export default function Profile() {
  const { currentUser, updateProfile, deleteAccount } = useContext(MarketplaceContext);
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [paysCode, setPaysCode] = useState(currentUser?.paysCode || 'TG');
  const [telephone, setTelephone] = useState(currentUser?.telephone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedCountry = getCountryByCode(paysCode);
  const wantsPasswordChange = newPassword.length > 0 || confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !telephone) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const phoneDigits = telephone.replace(/\D/g, '');
    if (phoneDigits.length < 6) {
      setError('Numéro de téléphone invalide.');
      return;
    }

    if (wantsPasswordChange) {
      if (!currentPassword) {
        setError('Indiquez votre mot de passe actuel pour le modifier.');
        return;
      }
      if (newPassword.length < 6) {
        setError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Les nouveaux mots de passe ne correspondent pas.');
        return;
      }
    }

    setIsSubmitting(true);
    const result = await updateProfile({
      name,
      email,
      paysCode,
      telephone,
      currentPassword: wantsPasswordChange ? currentPassword : undefined,
      newPassword: wantsPasswordChange ? newPassword : undefined,
      confirmPassword: wantsPasswordChange ? confirmPassword : undefined,
    });
    setIsSubmitting(false);

    if (result.success) {
      setSuccess('Profil mis à jour avec succès.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(result.error || 'Échec de la mise à jour.');
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (!deletePassword) {
      setError('Indiquez votre mot de passe pour confirmer la suppression.');
      return;
    }

    setIsDeleting(true);
    const result = await deleteAccount(deletePassword);
    setIsDeleting(false);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error || 'Échec de la suppression du compte.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Mon profil</h1>
        <p className="text-sm text-slate-500 mt-1">
          Modifiez vos informations personnelles ou changez votre mot de passe.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glassmorphism p-6 sm:p-8 rounded-3xl shadow-xl border border-white/40 space-y-5">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Nom complet
          </label>
          <div className="relative">
            <HiOutlineUser className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); setSuccess(''); }}
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
              onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess(''); }}
              placeholder="contact@entreprise.tg"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
            />
          </div>
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
                onChange={(e) => { setTelephone(e.target.value); setError(''); setSuccess(''); }}
                placeholder="90 00 00 00"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineShieldCheck className="w-4 h-4 text-brand-500" />
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Changer le mot de passe (optionnel)
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Mot de passe actuel
              </label>
              <PasswordInput
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setError(''); setSuccess(''); }}
                placeholder="Requis uniquement si vous changez le mot de passe"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Nouveau mot de passe
              </label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setError(''); setSuccess(''); }}
                placeholder="Minimum 6 caractères"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Confirmer le nouveau mot de passe
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); setSuccess(''); }}
                placeholder="Répétez le nouveau mot de passe"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>

      <div className="mt-8 glassmorphism p-6 sm:p-8 rounded-3xl shadow-xl border border-rose-100/60">
        <div className="flex items-start gap-3">
          <HiOutlineTrash className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-sm font-bold text-slate-800">Supprimer mon compte</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Cette action est irréversible. Toutes vos annonces seront supprimées et vous serez déconnecté.
            </p>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => { setShowDeleteConfirm(true); setError(''); setSuccess(''); }}
                className="mt-4 text-xs font-bold text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 px-4 py-2 rounded-lg transition-colors"
              >
                Supprimer mon compte
              </button>
            ) : (
              <form onSubmit={handleDeleteAccount} className="mt-4 space-y-3">
                <PasswordInput
                  value={deletePassword}
                  onChange={(e) => { setDeletePassword(e.target.value); setError(''); }}
                  placeholder="Confirmez avec votre mot de passe"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isDeleting}
                    className="text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isDeleting ? 'Suppression...' : 'Confirmer la suppression'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}
                    className="text-xs font-bold text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg border border-slate-200 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
