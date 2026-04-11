"use client";
import React from "react";
import { ArrowUpDown } from "lucide-react";

const OPTIONS = [
  { value: "date_desc", label: "Fecha: más recientes primero" },
  { value: "date_asc", label: "Fecha: más antiguos primero" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "price_asc", label: "Precio: menor a mayor" },
];

const SortBySelect = ({ value, onChange }) => {
  return (
    <label className="inline-flex items-center gap-2 bg-white border border-brand-dark/20 rounded-md px-3 py-2 shadow-sm">
      <ArrowUpDown className="w-4 h-4 text-brand-dark" />
      <span className="text-sm font-semibold text-brand-dark">Ordenar por:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm text-brand-dark font-medium focus:outline-none cursor-pointer"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
};

export default SortBySelect;
