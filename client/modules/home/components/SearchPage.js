"use client";
import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import PropertyComparator from './PropertyComparator'; // Importar el comparador
import { properties } from '../mock/properties';
import SearchFilters from './SearchFilters';
import SearchMap from './SearchMap';
import Link from "next/link";
import { usePropertyFilters } from "@/modules/global_components/context_files/PropertyFilterContext";

const SearchPage = ({ onNavigate, initialFilters }) => {
  const { filters: activeFilters, updateFilter, resetFilters } = usePropertyFilters();
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [showMap, setShowMap] = useState(false);
  const [propertiesToCompare, setPropertiesToCompare] = useState([]); // Estado para propiedades a comparar

  const applyFilters = (filtersToApply) => {
    let results = [...properties];
    
    if (filtersToApply.propertyType) {
      results = results.filter(property => property.type === filtersToApply.propertyType);
    }
    if (filtersToApply.gender) {
      results = results.filter(property => property.features.includes(filtersToApply.gender));
    }
    if (filtersToApply.furnished) {
      const isFurnished = filtersToApply.furnished === "Sí";
      results = results.filter(property => isFurnished ? property.features.includes("Amueblada") : !property.features.includes("Amueblada"));
    }
    if (filtersToApply.bathroomType) {
      const isPrivateBathroom = filtersToApply.bathroomType === "Propio";
      results = results.filter(property => property.type === "Cuarto" && (isPrivateBathroom ? property.features.includes("Baño privado") : property.features.includes("Baño compartido")));
    }
    if (filtersToApply.numberOfBathrooms) {
      results = results.filter(property => {
        if (property.type === "Casa" || property.type === "Departamento") {
          if (filtersToApply.numberOfBathrooms === "3+") {
            return property.bathrooms >= 3;
          }
          return property.bathrooms === parseInt(filtersToApply.numberOfBathrooms);
        }
        return true;
      });
    }
    if (filtersToApply.services) {
      const hasServices = filtersToApply.services === "Con servicios";
      results = results.filter(property => hasServices ? property.features.includes("Servicios incluidos") : !property.features.includes("Servicios incluidos"));
    }
    if (filtersToApply.budgetFilterActive) {
      results = results.filter(property => property.price <= filtersToApply.maxBudget);
    }
    if (filtersToApply.amenities.length > 0) {
      results = results.filter(property => filtersToApply.amenities.every(amenity => property.features.includes(amenity)));
    }
    if (filtersToApply.petFriendly) {
      results = results.filter(property => property.petFriendly);
    }
    // Filtrar por estacionamiento
    if (filtersToApply.parking) {
      if (filtersToApply.propertyType === "Cuarto") {
        const hasParking = filtersToApply.parking === "Sí";
        results = results.filter(property => hasParking ? property.parkingSpaces > 0 : property.parkingSpaces === 0);
      } else if (filtersToApply.propertyType === "Casa" || filtersToApply.propertyType === "Departamento") {
        // Si se seleccionó un número específico de lugares
        if (filtersToApply.numberOfParkingSpaces) {
          if (filtersToApply.numberOfParkingSpaces === "3+") {
            results = results.filter(property => property.parkingSpaces >= 3);
          } else {
            results = results.filter(property => property.parkingSpaces === parseInt(filtersToApply.numberOfParkingSpaces));
          }
        } else { // Si solo se seleccionó "Sí" sin especificar número
          results = results.filter(property => property.parkingSpaces > 0);
        }
      }
    }
    if (filtersToApply.includedServices && filtersToApply.includedServices.length > 0) {
      results = results.filter(property =>
        property.includedServices &&
        filtersToApply.includedServices.every(servicio => property.includedServices.includes(servicio))
      );
    }
    if (filtersToApply.securityType) {
      results = results.filter(property => property.securityType === filtersToApply.securityType);
    }
    
    setFilteredProperties(results);
  };

  useEffect(() => {
    applyFilters(activeFilters);
  }, [activeFilters]);

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
                <h3 className="text-xl font-bold text-black">{filteredProperties.length} resultados</h3>
                <p className="text-gray-600 text-sm">Mostrando las mejores opciones para ti</p>
              </div>
              <div className="flex space-x-4">
                {propertiesToCompare.length > 0 && (
                  <Link 
                    to="/compare"
                    onClick={handleGoToCompare}
                    className="flex items-center px-4 py-2 bg-black text-white rounded-md font-bold hover:bg-gray-800 transition duration-300"
                  >
                    Comparar ({propertiesToCompare.length})
                  </Link>
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
                    {filteredProperties.map(property => (
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
                  <SearchMap properties={filteredProperties} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map(property => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      onViewDetails={() => {}}
                      onCompareToggle={() => {}}
                      isComparing={propertiesToCompare.some(p => p.id === property.id)}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-16">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-bold text-black">No se encontraron propiedades</h3>
                    <p className="mt-2 text-gray-600">Intenta ajustar tus filtros para ver más resultados.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
