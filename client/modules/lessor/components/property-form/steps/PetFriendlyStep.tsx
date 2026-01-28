'use client';

import React from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { OptionCard } from '../ui';

/**
 * Step 10: Pet Friendly Status
 * Question: "¿Es pet friendly?"
 * Auto-advances on selection
 */
export const PetFriendlyStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors } = state;

  const handleSelect = (value: boolean) => {
    console.log('[PetFriendlyStep] handleSelect called with:', value);
    console.log('[PetFriendlyStep] Current step:', state.currentStep);
    console.log('[PetFriendlyStep] Form data before update:', state.formData);

    updateFormData({ isPetFriendly: value });

    // Usar setTimeout para asegurar que el estado se actualice antes de avanzar
    console.log('[PetFriendlyStep] Calling nextStep in 50ms...');
    setTimeout(() => {
      console.log('[PetFriendlyStep] Executing nextStep NOW');
      nextStep();
      console.log('[PetFriendlyStep] nextStep called');
    }, 50);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        ¿Se permiten mascotas?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OptionCard
          label="Sí"
          selected={formData.isPetFriendly === true}
          onClick={() => handleSelect(true)}
        />
        <OptionCard
          label="No"
          selected={formData.isPetFriendly === false}
          onClick={() => handleSelect(false)}
        />
      </div>

      {/* Error message removed - not needed for auto-advance steps */}

      {/* Back button */}
      <div className="flex justify-start mt-6">
        <button
          onClick={previousStep}
          className="px-6 py-2 border border-[#042a5c] text-[#042a5c] rounded-lg hover:bg-gray-50 transition-colors"
        >
          Atrás
        </button>
      </div>
    </div>
  );
};