"use client";
import React, { useState } from 'react';

const SearchBar = () => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
    roommates: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = () => {
    console.log('Búsqueda con parámetros:', searchParams);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 -mt-12 relative z-10">
      <div
        className="bg-white rounded-lg shadow-2xl p-6 border border-gray-100"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Ubicación */}
          <div className="space-y-2">
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-brand-dark"
            >
              Ubicación
            </label>
            <div className="relative">
              <select
                id="location"
                name="location"
                value={searchParams.location}
                onChange={handleChange}
                className="w-full px-3 py-2 text-brand-dark bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="">Selecciona campus</option>
                <option value="monterrey">Campus Monterrey</option>
                <option value="cdmx">Campus Ciudad de México</option>
                <option value="guadalajara">Campus Guadalajara</option>
                <option value="puebla">Campus Puebla</option>
                <option value="queretaro">Campus Querétaro</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Tipo de propiedad */}
          <div className="space-y-2">
            <label
              htmlFor="propertyType"
              className="block text-sm font-semibold text-brand-dark"
            >
              Tipo de propiedad
            </label>
            <div className="relative">
              <select
                id="propertyType"
                name="propertyType"
                value={searchParams.propertyType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-brand-dark bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="">Cualquier tipo</option>
                <option value="room">Habitación</option>
                <option value="apartment">Apartamento</option>
                <option value="house">Casa</option>
                <option value="studio">Estudio</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Rango de precio */}
          <div className="space-y-2">
            <label
              htmlFor="priceRange"
              className="block text-sm font-semibold text-brand-dark"
            >
              Rango de precio
            </label>
            <div className="relative">
              <select
                id="priceRange"
                name="priceRange"
                value={searchParams.priceRange}
                onChange={handleChange}
                className="w-full px-3 py-2 text-brand-dark bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="">Cualquier precio</option>
                <option value="0-3000">$0 - $3,000</option>
                <option value="3000-5000">$3,000 - $5,000</option>
                <option value="5000-8000">$5,000 - $8,000</option>
                <option value="8000-12000">$8,000 - $12,000</option>
                <option value="12000+">$12,000+</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Botón de búsqueda */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full px-4 py-2 text-brand-dark font-bold text-base rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: "#fdd76c",
                borderColor: "#fdd76c",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#fccc4d";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#fdd76c";
              }}
              onFocus={(e) => {
                e.target.style.boxShadow =
                  "0 0 0 2px #fdd76c, 0 0 0 4px rgba(253, 215, 108, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "";
              }}
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Checkbox para roommates */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="checkbox"
                id="roommates"
                name="roommates"
                checked={searchParams.roommates}
                onChange={handleChange}
                className="sr-only"
              />
              <label
                htmlFor="roommates"
                className="flex items-center cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    searchParams.roommates
                      ? "bg-yellow-400 border-yellow-400"
                      : "border-gray-300 bg-white hover:border-yellow-400"
                  }`}
                >
                  {searchParams.roommates && (
                    <svg
                      className="w-3 h-3 text-black"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="ml-2 text-brand-dark font-medium text-sm">
                  Busco también roomies compatibles
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;