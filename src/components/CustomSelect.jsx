import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineChevronDown, HiOutlineCheck } from 'react-icons/hi2';

export default function CustomSelect({
  value,
  onChange,
  options,
  icon: Icon,
  className = '',
  menuClassName = '',
  variant = 'default',
  menuAlign = 'right',
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = options.find((opt) => opt.value === value) || options[0];

  const isForm = variant === 'form';
  const menuPosition = menuAlign === 'left' ? 'left-0' : 'right-0';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 w-full ${
          isForm ? 'min-w-0' : 'min-w-[200px]'
        } border rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 transition-all duration-200 ${
          isForm
            ? 'bg-slate-50 border-slate-200/80 focus:bg-white'
            : 'bg-white border-slate-200 hover:bg-slate-50'
        } ${
          open
            ? 'border-brand-400 ring-2 ring-brand-100 shadow-sm'
            : isForm
              ? 'hover:border-slate-300'
              : 'hover:border-slate-300'
        }`}
      >
        {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
        <span className="flex-1 text-left truncate">{selected.label}</span>
        <HiOutlineChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-brand-500' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute ${menuPosition} top-full mt-2 z-50 min-w-full bg-white rounded-xl border border-slate-100 shadow-lg overflow-hidden animate-fade-in ${menuClassName}`}
        >
          <ul className="py-1.5 max-h-64 overflow-y-auto custom-scroll">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs font-semibold text-left transition-colors ${
                      isSelected
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <HiOutlineCheck className="w-4 h-4 text-brand-500 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
