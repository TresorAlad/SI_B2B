import React, { useState } from 'react';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  className = '',
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <HiOutlineLockClosed className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-semibold"
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {visible ? (
          <HiOutlineEyeSlash className="w-4 h-4" />
        ) : (
          <HiOutlineEye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
