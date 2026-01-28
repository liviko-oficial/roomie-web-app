'use client';

import React from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { OptionCard } from '../ui';

/**
 * Step 12: Security Status
 * Question: "¿Cuenta con seguridad privada?"
 * Auto-advances on selection
 */
export const SecurityStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors } = state;

  const handleSelect = (value: boolean) => {
    updateFormData({ hasSecurity: value });
    nextStep(); // Auto-advance on selection
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        ¿Cuenta con seguridad privada?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OptionCard
          label="Sí"
          selected={formData.hasSecurity === true}
          onClick={() => handleSelect(true)}
        />
        <OptionCard
          label="No"
          selected={formData.hasSecurity === false}
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