import React from 'react';

export default function ProductStatusBadge({ status }) {
  let badgeStyle = "";
  
  switch (status) {
    case "Disponible":
      badgeStyle = "bg-emerald-50 text-emerald-700 border border-emerald-200/50";
      break;
    case "Réservé":
      badgeStyle = "bg-amber-50 text-amber-700 border border-amber-200/50";
      break;
    case "Indisponible":
      badgeStyle = "bg-slate-100 text-slate-600 border border-slate-200/50";
      break;
    default:
      badgeStyle = "bg-slate-100 text-slate-600 border border-slate-200/50";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${badgeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === "Disponible" ? "bg-emerald-500" :
        status === "Réservé" ? "bg-amber-500" : "bg-slate-400"
      }`}></span>
      {status}
    </span>
  );
}
