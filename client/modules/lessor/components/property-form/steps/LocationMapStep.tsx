'use client';

import React, { useState } from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { NavigationButtons } from '../ui';

/**
 * Step 16: Location Map Selection
 * Question: "Selecciona la ubicación"
 * Placeholder for future Google Maps integration
 */
export const LocationMapStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData } = state;
  const [searchAddress, setSearchAddress] = useState(formData.address || '');
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);

  const handleSearch = () => {
    // Placeholder for future map search functionality
    console.log('Searching for:', searchAddress);
    // In the future, this would trigger a Google Maps search
    setIsLocationConfirmed(true);
  };

  const handleNext = () => {
    // In the future, save the coordinates
    if (isLocationConfirmed) {
      // Example: updateFormData({ coordinates: { lat: 25.686613, lng: -100.316116 } });
    }
    nextStep();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        Selecciona la ubicación en el mapa
      </h2>

      <p className="text-gray-600">
        Busca y confirma la ubicación exacta de tu propiedad. Esta información ayudará a los inquilinos a encontrar tu propiedad.
      </p>

      {/* Search bar */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Buscar dirección
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-[#042a5c]/30 rounded-lg focus:border-[#fdd76c] outline-none"
            placeholder="Ingresa la dirección para buscar en el mapa"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-[#fdd76c] text-[#042a5c] font-medium rounded-lg hover:bg-[#fdd76c]/90 transition-colors"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="w-full h-96 bg-[#042a5c]/10 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-[#042a5c]/30">
        <svg
          className="w-16 h-16 text-[#042a5c]/50 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p className="text-[#042a5c]/70 font-medium text-lg mb-2">
          Integración con Google Maps
        </p>
        <p className="text-[#042a5c]/50 text-sm text-center max-w-md">
          La funcionalidad del mapa estará disponible en la Fase 2 del proyecto.
          Por ahora, puedes continuar con el siguiente paso.
        </p>
      </div>

      {/* Location confirmation */}
      {searchAddress && (
        <div className="bg-[#fdd76c]/20 border border-[#fdd76c] rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[#042a5c] mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-[#042a5c] font-medium">
                Ubicación temporal guardada
              </p>
              <p className="text-[#042a5c]/70 text-sm mt-1">
                {searchAddress}
              </p>
              <p className="text-[#042a5c]/50 text-xs mt-2">
                Podrás actualizar la ubicación exacta cuando el mapa esté disponible.
              </p>
            </div>
          </div>
        </div>
      )}

      <NavigationButtons
        onBack={previousStep}
        onNext={handleNext}
        nextLabel="Continuar"
      />
    </div>
  );
};