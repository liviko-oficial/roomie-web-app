"use client";
import React, { useState, useMemo } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import RequestCard from "../components/RequestCard";
import { offerStatusLabels } from "../mock/requests";
import SortBySelect from "@/modules/renter-dashboard/components/SortBySelect";
import { sortProperties } from "@/modules/renter-dashboard/utils/categorize";

// Panel de filtros expandible
const FilterPanel = ({ filters, setFilters, requests, onReset }) => {
  const priceRange = useMemo(() => {
    const prices = requests.map((r) => r.property.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [requests]);

  const offerStatusOptions = [
    { value: "all", label: "Todos" },
    { value: "sin_oferta", label: offerStatusLabels.sin_oferta },
    { value: "contraoferta_por_revisar", label: offerStatusLabels.contraoferta_por_revisar },
    { value: "oferta_aceptada", label: offerStatusLabels.oferta_aceptada },
    { value: "oferta_rechazada", label: offerStatusLabels.oferta_rechazada },
  ];

  const hasActiveFilters =
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.offerStatus !== "all";

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-6 animate-slideIn">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 flex-wrap">
        {/* Rango de precio */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-brand-dark mb-1.5">
            Rango de precio (mensual)
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
              <input
                type="number"
                placeholder={priceRange.min.toLocaleString("es-MX")}
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full pl-6 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent text-brand-dark placeholder-gray-400"
              />
            </div>
            <span className="text-xs text-gray-400 font-medium">—</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
              <input
                type="number"
                placeholder={priceRange.max.toLocaleString("es-MX")}
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full pl-6 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent text-brand-dark placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Estado de oferta */}
        <div className="min-w-[180px]">
          <label className="block text-xs font-semibold text-brand-dark mb-1.5">
            Estado de oferta
          </label>
          <select
            value={filters.offerStatus}
            onChange={(e) => setFilters({ ...filters, offerStatus: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent text-brand-dark bg-white appearance-none cursor-pointer"
          >
            {offerStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Boton de limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-brand-dark bg-gray-50 hover:bg-gray-100 rounded-lg transition self-end"
          >
            <RotateCcw className="w-3 h-3" />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};

// Secciones horizontales de solicitudes agrupadas por estado
const RequestColumns = ({ requests }) => {
  const [sortBy, setSortBy] = useState("date_desc");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    offerStatus: "all",
  });

  const defaultFilters = { minPrice: "", maxPrice: "", offerStatus: "all" };

  const hasActiveFilters =
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.offerStatus !== "all";

  // Filtrar primero, luego ordenar
  const processed = useMemo(() => {
    const filtered = requests.filter((r) => {
      if (filters.minPrice !== "" && r.property.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice !== "" && r.property.price > Number(filters.maxPrice)) return false;
      if (filters.offerStatus !== "all" && r.offerStatus !== filters.offerStatus) return false;
      return true;
    });
    // sortProperties espera "price" en el nivel raiz
    const adapted = filtered.map((r) => ({ ...r, price: r.property.price }));
    return sortProperties(adapted, sortBy);
  }, [requests, filters, sortBy]);

  const enProceso = processed.filter((r) => r.status === "en_proceso");
  const aprobadas = processed.filter((r) => r.status === "aprobada");
  const rechazadas = processed.filter((r) => r.status === "rechazada");

  const SectionHeader = ({ icon: Icon, title, count, colorClass }) => (
    <div className={`flex items-center gap-2 mb-4 pb-3 border-b-2 ${colorClass}`}>
      <Icon className="w-5 h-5" />
      <h2 className="text-lg font-bold text-brand-dark">{title}</h2>
      <span className="ml-2 bg-gray-100 text-brand-dark text-sm font-medium px-2 py-1 rounded-full">
        {count}
      </span>
    </div>
  );

  const EmptyState = ({ message }) => (
    <div className="text-center py-8 text-gray-400 w-full">
      <p className="text-sm">{message}</p>
    </div>
  );

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans space-y-6">
        {/* Controles: ordenar + filtros */}
        <div className="flex items-center justify-end gap-3 flex-wrap">
          <SortBySelect value={sortBy} onChange={setSortBy} />
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${
              filtersOpen || hasActiveFilters
                ? "bg-brand-dark text-white hover:bg-gray-800"
                : "bg-white text-brand-dark hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {filtersOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <SlidersHorizontal className="w-4 h-4" />
            )}
            Filtros
            {hasActiveFilters && !filtersOpen && (
              <span className="ml-1 w-2 h-2 bg-brand-accent rounded-full" />
            )}
          </button>
        </div>

        {/* Panel de filtros (expandible) */}
        {filtersOpen && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            requests={requests}
            onReset={() => setFilters(defaultFilters)}
          />
        )}

        {/* Seccion: En Proceso */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <SectionHeader
            icon={Clock}
            title="En proceso"
            count={enProceso.length}
            colorClass="border-brand-accent text-brand-dark"
          />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {enProceso.length > 0 ? (
              enProceso.map((request, index) => (
                <div key={request.id} className="min-w-[280px] max-w-[300px] flex-shrink-0">
                  <RequestCard request={request} index={index} />
                </div>
              ))
            ) : (
              <EmptyState message="No hay solicitudes en proceso" />
            )}
          </div>
        </div>

        {/* Seccion: Aprobadas */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <SectionHeader
            icon={CheckCircle}
            title="Aprobadas"
            count={aprobadas.length}
            colorClass="border-green-500 text-green-600"
          />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {aprobadas.length > 0 ? (
              aprobadas.map((request, index) => (
                <div key={request.id} className="min-w-[280px] max-w-[300px] flex-shrink-0">
                  <RequestCard request={request} index={index} />
                </div>
              ))
            ) : (
              <EmptyState message="No hay solicitudes aprobadas" />
            )}
          </div>
        </div>

        {/* Seccion: Rechazadas */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <SectionHeader
            icon={XCircle}
            title="Rechazadas"
            count={rechazadas.length}
            colorClass="border-red-500 text-red-600"
          />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {rechazadas.length > 0 ? (
              rechazadas.map((request, index) => (
                <div key={request.id} className="min-w-[280px] max-w-[300px] flex-shrink-0">
                  <RequestCard request={request} index={index} />
                </div>
              ))
            ) : (
              <EmptyState message="No hay solicitudes rechazadas" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestColumns;
