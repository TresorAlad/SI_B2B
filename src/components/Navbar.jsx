import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineMapPin, HiChevronDown, HiOutlineChatBubbleLeftRight, HiOutlineBell, HiOutlineUserCircle, HiPlus } from 'react-icons/hi2';
import { MarketplaceContext } from '../context/MarketplaceContext';

export default function Navbar() {
  const { currentUser, logout, favorites } = useContext(MarketplaceContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Location Capsule */}
          <div className="flex items-center">
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-full text-sm border border-slate-700/50 cursor-pointer transition-colors duration-200">
              <HiOutlineMapPin className="w-4 h-4 text-brand-400" />
              <span className="font-medium text-slate-200 text-xs">Lomé, Togo</span>
              <HiChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            
            {/* Mobile menu toggle or simple links */}
            <div className="flex sm:hidden space-x-3 text-xs">
              <Link to="/" className={`font-semibold ${isActive('/') ? 'text-brand-400' : 'text-slate-300'}`}>Accueil</Link>
              <Link to="/favorites" className={`font-semibold ${isActive('/favorites') ? 'text-brand-400' : 'text-slate-300'}`}>Favoris</Link>
              <Link 
                to={currentUser ? "/dashboard" : "/login"} 
                state={!currentUser ? { from: { pathname: "/dashboard" }, requireAuth: true } : undefined}
                className={`font-semibold ${isActive('/dashboard') ? 'text-brand-400' : 'text-slate-300'}`}
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Center: Brand Logo (as in the mockup image) */}
          <div className="flex-1 flex justify-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            <Link to="/" className="flex items-center space-x-2 bg-slate-800/20 px-3 py-1 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-brand-500/30">
                B
              </div>
              <span className="text-base font-extrabold tracking-tight">
                B2B.<span className="text-brand-400">Hunt</span>
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-6 mr-2">
              <Link 
                to="/" 
                className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
                  isActive('/') ? 'text-brand-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                Acheter
              </Link>
              <Link 
                to="/favorites" 
                className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 flex items-center space-x-1 ${
                  isActive('/favorites') ? 'text-brand-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Favoris</span>
                {favorites.length > 0 && (
                  <span className="bg-brand-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link 
                to={currentUser ? "/dashboard" : "/login"} 
                state={!currentUser ? { from: { pathname: "/dashboard" }, requireAuth: true } : undefined}
                className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
                  isActive('/dashboard') ? 'text-brand-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                Mon Espace
              </Link>
            </nav>

            {/* Simulated Icons with notifications */}
            <div className="relative cursor-pointer hover:bg-slate-800 p-1.5 rounded-full transition-colors duration-200">
              <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-slate-300 hover:text-white" />
              <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                1
              </span>
            </div>

            <div className="relative cursor-pointer hover:bg-slate-800 p-1.5 rounded-full transition-colors duration-200">
              <HiOutlineBell className="w-5 h-5 text-slate-300 hover:text-white" />
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                2
              </span>
            </div>

            {/* Profile Avatar / Login actions */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-1 focus:outline-none"
                  aria-expanded={dropdownOpen}
                >
                  <img
                    className="h-8 sm:h-9 w-8 sm:w-9 rounded-full object-cover border-2 border-slate-700 hover:border-brand-500 transition-colors"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=3b82f6&color=fff&bold=true`}
                    alt={currentUser.name}
                  />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 text-slate-800 transform origin-top-right transition duration-200 scale-100">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        <p className="text-[10px] bg-slate-100 text-slate-600 inline-block px-1.5 py-0.5 rounded mt-1 font-medium">{currentUser.name}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        Tableau de bord
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        Mes favoris ({favorites.length})
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-semibold border-t border-slate-100 mt-1"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 px-3.5 py-2 rounded-lg transition-colors border border-slate-700/50"
              >
                Connexion
              </Link>
            )}

            {/* Main call to action: Sell button */}
            <Link
              to={currentUser ? "/add-product" : "/login"}
              state={!currentUser ? { from: { pathname: "/add-product" }, requireAuth: true } : undefined}
              className="flex items-center space-x-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold py-2 px-3 sm:px-4 rounded-lg shadow-md shadow-brand-500/20 hover:shadow-brand-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <HiPlus className="w-4 h-4" />
              <span>Publier</span>
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
}
