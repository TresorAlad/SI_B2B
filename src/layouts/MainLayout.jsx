import React from 'react';
import Navbar from '../components/Navbar';
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineLockClosed } from 'react-icons/hi2';


export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Column 1: Brand details */}
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2 bg-slate-800/10 inline-block px-1 py-1 rounded">
                <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs">
                  B
                </div>
                <span className="text-base font-extrabold tracking-tight text-white">
                  B2B.<span className="text-brand-400">Hunt</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                La plateforme marketplace B2B de référence en Afrique de l'Ouest, facilitant la mise en relation sécurisée et fluide entre acheteurs et vendeurs via WhatsApp.
              </p>
              <div className="flex space-x-3 text-xs text-slate-500">
                <span>Lomé</span> • <span>Cotonou</span> • <span>Abidjan</span> • <span>Dakar</span>
              </div>
            </div>

            {/* Column 2: Quick navigation */}
            <div>
              <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-2.5">Marketplace</h3>
              <ul className="space-y-1.5 text-xs">
                <li><a href="/" className="hover:text-white transition-colors">Tous les produits</a></li>
                <li><a href="/favorites" className="hover:text-white transition-colors">Mes favoris</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard vendeur</a></li>
                <li><a href="/add-product" className="hover:text-white transition-colors">Publier un produit</a></li>
              </ul>
            </div>

            {/* Column 3: Safety / Guarantee */}
            <div>
              <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-2.5">Garantie & Sécurité</h3>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start space-x-2">
                  <HiOutlineLockClosed className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>Négociations directes et transparentes sur WhatsApp sans intermédiaire.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <HiOutlinePhone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Support client disponible 7j/7 pour la vérification des comptes vendeurs.</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter / Contact */}
            <div>
              <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-2.5">Contact commercial</h3>
              <p className="text-xs mb-2 text-slate-400">Pour tout partenariat ou réclamation, écrivez-nous.</p>
              <div className="flex items-center space-x-2 bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                <HiOutlineEnvelope className="w-4 h-4 text-brand-400" />
                <span className="text-xs text-slate-200">contact@b2bhunt.tg</span>
              </div>
            </div>
            
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
            <p>© 2026 B2B.Hunt. Tous droits réservés.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-slate-400">Mentions Légales</a>
              <a href="#" className="hover:text-slate-400">Conditions Générales</a>
              <a href="#" className="hover:text-slate-400">Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
