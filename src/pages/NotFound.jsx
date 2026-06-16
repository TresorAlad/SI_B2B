import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto my-12">
      <h1 className="text-4xl font-black text-slate-900 mb-2">404</h1>
      <h3 className="text-lg font-extrabold text-slate-800 mb-2">Page introuvable</h3>
      <p className="text-sm text-slate-400 mb-6">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-5 rounded-xl transition-all inline-block"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
