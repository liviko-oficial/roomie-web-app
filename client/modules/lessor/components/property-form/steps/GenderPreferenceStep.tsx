'use client';

import React from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { OptionCard } from '../ui';
import { GENDER_OPTIONS } from '@/modules/lessor/utils/constants';
import type { GenderPreference } from '@/modules/lessor/types/property-form.types';

/**
 * Step 3: Gender Preference Selection
 * Question: "¿A qué género buscas rentar?"
 * Auto-advances on selection
 */
export const GenderPreferenceStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors } = state;

  const handleSelect = (value: GenderPreference) => {
    updateFormData({ genderPreference: value });
    // Use setTimeout to ensure state updates before advancing
    setTimeout(() => {
      nextStep();
    }, 50);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        ¿A qué género buscas rentar?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GENDER_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            selected={formData.genderPreference === option.value}
            onClick={() => handleSelect(option.value as GenderPreference)}
          />
        ))}
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