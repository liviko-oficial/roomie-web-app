'use client';

import React from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { OptionCard } from '../ui';
import { RENTAL_TYPES } from '@/modules/lessor/utils/constants';
import type { RentalType } from '@/modules/lessor/types/property-form.types';

/**
 * Step 2: Rental Type Selection
 * Question: "¿Qué buscas rentar?"
 * Auto-advances on selection and sets flow type if room rental
 */
export const RentalTypeStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep,
    setFlowType
  } = usePropertyForm();

  const { formData, errors } = state;

  const handleSelect = (value: RentalType) => {
    updateFormData({ rentalType: value });

    // Detect if it's a room rental and set flow type
    if (value === 'room_in_house' || value === 'room_in_apartment') {
      setFlowType?.('multiple');
    } else {
      setFlowType?.('single');
    }

    // Use setTimeout to ensure state updates before advancing
    setTimeout(() => {
      nextStep();
    }, 50);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        ¿Qué buscas rentar?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RENTAL_TYPES.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            selected={formData.rentalType === option.value}
            onClick={() => handleSelect(option.value as RentalType)}
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