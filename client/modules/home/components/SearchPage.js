"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropertyCard from './PropertyCard';
import PropertyComparator from './PropertyComparator';
import { propertySummary } from '../mappers/propertySummary';
import { propertyService } from '@/lib/api/propertyService';
import SearchFilters from './SearchFilters';
import SearchMap from './SearchMap';
import Link from "next/link";
import { usePropertyFilters } from "@/modules/global_components/context_files/PropertyFilterContext";

const ITEMS_PER_PAGE = 12;

const SearchPage = ({ onNavigate, initialFilters }) => {
  const { filters: activeFilters, updateFilter, resetFilters } = usePropertyFilters();
  const [properties, setProperties] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [propertiesToCompare, setPropertiesToCompare] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPaginas: 1, totalPropiedades: 0, tieneSiguiente: false, tieneAnterior: false });
  const debounceRef = useRef(null);

  const buildServerParams = useCallback((filtersToApply, currentPage) => {
    const params = { page: currentPage, limit: ITEMS_PER_PAGE };

    if (filtersToApply.propertyType) params.tipoPropiedad = JSON.stringify([filtersToApply.propertyType]);
    if (filtersToApply.gender) params.generoPreferido = JSON.stringify([filtersToApply.gender]);
    if (filtersToApply.furnished) params.amueblado = filtersToApply.furnished === "Sí";
    if (filtersToApply.petFriendly) params.mascotasPermitidas = true;
    if (filtersToApply.numberOfBathrooms) {
      const val = filtersToApply.numberOfBathrooms === "3+" ? 3 : parseInt(filtersToApply.numberOfBathrooms);
      params.numeroBanos = val;
    }
    if (filtersToApply.budgetFilterActive && filtersToApply.maxBudget) params.precioMaximo = filtersToApply.maxBudget;

    return params;
  }, []);

  const fetchProperties = useCallback(async (filtersToApply, currentPage) => {
    setLoading(true);
    try {
      const params = buildServerParams(filtersToApply, currentPage);
      const res = await propertyService.getAll(params);
      const mapped = (res.data || []).map(propertySummary).filter(Boolean);
      setProperties(mapped);
      if (res.paginacion) setPagination(res.paginacion);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [buildServerParams]);

  // Fetch cuando cambian filtros (con debounce 300ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchProperties(activeFilters, 1);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [activeFilters, fetchProperties]);

  // Fetch cuando cambia la pagina (sin debounce)
  const goToPage = (newPage) => {
    setPage(newPage);
    fetchProperties(activeFilters, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  const handleCompareToggle = (property) => {
    setPropertiesToCompare(prev => {
      if (prev.some(p => p.id === property.id)) {
        return prev.filter(p => p.id !== property.id);
      } else {
        if (prev.length < 3) {
          return [...prev, property];
        } else {
          alert("Solo puedes seleccionar un máximo de 3 propiedades para comparar.");
          return prev;
        }
      }
    });
  };

  const handleGoToCompare = () => {
    if (propertiesToCompare.length > 0) {
      onNavigate('comparePage', propertiesToCompare, activeFilters);
    } else {
      alert("Selecciona al menos una propiedad para comparar.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-20 h-full">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-bold text-black">Filtros</h2>
              </div>
              <SearchFilters onFilterChange={() => {}} activeFilters={activeFilters} />
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-black">{pagination.totalPropiedades} resultados</h3>
                <p className="text-gray-600 text-sm">Página {page} de {pagination.totalPaginas}</p>
              </div>
              <div className="flex space-x-4">
                {propertiesToCompare.length > 0 && (
                  <button
                    onClick={handleGoToCompare}
                    className="flex items-center px-4 py-2 bg-black text-white rounded-md font-bold hover:bg-gray-800 transition duration-300"
                  >
                    Comparar ({propertiesToCompare.length})
                  </button>
                )}
                <button
                  onClick={toggleMapView}
                  className="flex items-center px-4 py-2 bg-[#FFDC30] text-black rounded-md font-medium hover:bg-yellow-400 transition duration-300"
                >
                  {showMap ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      Ver lista
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Ver mapa
                    </>
                  )}
                </button>
              </div>
            </div>
            {showMap ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 overflow-y-auto max-h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 gap-6">
                    {properties.map(property => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onViewDetails={() => {}}
                        onCompareToggle={() => {}}
                        isComparing={propertiesToCompare.some(p => p.id === property.id)}
                      />
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-2 sticky top-48">
                  <SearchMap properties={properties} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {properties.length > 0 ? (
                  properties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onViewDetails={() => {}}
                      onCompareToggle={() => {}}
                      isComparing={propertiesToCompare.some(p => p.id === property.id)}
                    />
                  ))
                ) : !loading ? (
                  <div className="col-span-2 text-center py-16">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-bold text-black">No se encontraron propiedades</h3>
                    <p className="mt-2 text-gray-600 max-w-md mx-auto">
                      Prueba ajustar los filtros o ampliar la búsqueda para ver más resultados.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-6 px-6 py-3 bg-brand-accent text-brand-dark rounded-md font-bold hover:bg-yellow-400 transition shadow-md"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            {/* Paginacion */}
            {pagination.totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8 pb-8">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={!pagination.tieneAnterior || loading}
                  className="px-4 py-2 rounded-md bg-gray-200 text-black font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-700">
                  {page} / {pagination.totalPaginas}
                </span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={!pagination.tieneSiguiente || loading}
                  className="px-4 py-2 rounded-md bg-[#FFDC30] text-black font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-400 transition"
                >
                  Siguiente
                </button>
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
