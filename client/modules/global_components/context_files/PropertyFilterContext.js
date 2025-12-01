"use client";
import { createContext, useContext, useState } from "react";

// 1 Crear el contexto
const PropertyFilterContext = createContext();

// 2 Proveedor del contexto
export const PropertyFilterProvider = ({ children }) => {
  // Estado inicial con los campos que mencionaste
  const [filters, setFilters] = useState({
    propertyType: "",
    gender: "",
    furnished: "",
    bathroomType: "",
    numberOfBathrooms: "",
    maxBudget: 35000,
    amenities: [],
    petFriendly: false,
    budgetFilterActive: false,
    parking: "",
    numberOfParkingSpaces: "",
  });

  // Función para actualizar uno o varios campos del filtro
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Función para reiniciar todos los filtros
  const resetFilters = () => {
    setFilters({
      propertyType: "",
      gender: "",
      furnished: "",
      bathroomType: "",
      numberOfBathrooms: "",
      maxBudget: 35000,
      amenities: [],
      petFriendly: false,
      budgetFilterActive: false,
      parking: "",
      numberOfParkingSpaces: "",
    });
  };

  return (
    <PropertyFilterContext.Provider value={{ filters, updateFilter, resetFilters }}>
      {children}
    </PropertyFilterContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const usePropertyFilters = () => useContext(PropertyFilterContext);

