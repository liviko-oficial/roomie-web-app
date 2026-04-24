"use client";
import React from "react";
import { Home, Plus } from "lucide-react";
import SortBySelect from "../components/SortBySelect";

const MyPropertiesHeader = ({ total, sortBy, onSortChange, onRegister }) => {
  return (
    <div className="bg-brand-accent pt-8 pb-8 md:pt-10 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Home className="w-8 h-8 text-brand-dark" />
              <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">Mis Propiedades</h1>
            </div>
            <p className="text-brand-dark text-lg">Administra todas tus propiedades registradas ({total})</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <SortBySelect value={sortBy} onChange={onSortChange} />
            <button onClick={onRegister} className="inline-flex items-center justify-center gap-2 bg-brand-dark text-white px-5 py-2.5 rounded-md font-bold hover:bg-brand-dark/90 transition shadow-md">
              <Plus className="w-5 h-5" /> Registrar propiedad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPropertiesHeader;
