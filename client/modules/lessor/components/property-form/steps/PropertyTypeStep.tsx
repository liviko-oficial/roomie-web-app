'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePropertyForm } from '@/modules/lessor';
import { OptionCard } from '../ui';
import { PROPERTY_TYPES } from '@/modules/lessor/utils/constants';
import type { PropertyType } from '@/modules/lessor/types/property-form.types';

/**
 * Step 1: Property Type Selection
 * Question: "¿Qué tipo de vivienda es?"
 * Auto-advances on selection
 */
export const PropertyTypeStep: React.FC = () => {
  const router = useRouter();
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors, currentStep } = state;

  const handleSelect = (value: PropertyType) => {
    updateFormData({ propertyType: value });
    // Use setTimeout to ensure state updates before advancing
    setTimeout(() => {
      nextStep();
    }, 50);
  };

  const handleCancel = () => {
    if (confirm('¿Seguro que quieres cancelar el registro? Se perderán todos los datos ingresados.')) {
      router.push('/lessor');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        ¿Qué tipo de vivienda es?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROPERTY_TYPES.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            selected={formData.propertyType === option.value}
            onClick={() => handleSelect(option.value as PropertyType)}
          />
        ))}
      </div>

      {/* Error message removed - not needed for auto-advance steps */}

      {/* Cancel button for first step */}
      <div className="flex justify-start mt-6">
        <button
          onClick={handleCancel}
          className="text-[#042a5c] hover:underline text-sm font-medium"
        >
          ← Cancelar y volver
        </button>
      </div>
    </div>
  );
};