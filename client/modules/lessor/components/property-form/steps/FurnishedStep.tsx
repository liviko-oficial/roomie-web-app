'use client';

import React from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { OptionCard } from '../ui';

/**
 * Step 6: Furnished Status
 * Question: "¿La propiedad está amueblada?"
 * Auto-advances on selection
 */
export const FurnishedStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors } = state;

  const handleSelect = (value: boolean) => {
    console.log('[FurnishedStep] handleSelect called with:', value);
    console.log('[FurnishedStep] Current step:', state.currentStep);
    console.log('[FurnishedStep] Form data before update:', state.formData);

    updateFormData({ isFurnished: value });

    // Use setTimeout to ensure state updates before advancing
    console.log('[FurnishedStep] Calling nextStep in 50ms...');
    setTimeout(() => {
      console.log('[FurnishedStep] Executing nextStep NOW');
      nextStep();
      console.log('[FurnishedStep] nextStep called');
    }, 50);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        ¿La propiedad está amueblada?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OptionCard
          label="Sí"
          selected={formData.isFurnished === true}
          onClick={() => handleSelect(true)}
        />
        <OptionCard
          label="No"
          selected={formData.isFurnished === false}
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