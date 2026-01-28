'use client';

import React, { useState } from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { MultiSelect, NavigationButtons } from '../ui';
import { AMENITIES_OPTIONS } from '@/modules/lessor/utils/constants';

/**
 * Step 11: Amenities Selection
 * Question: "¿Qué amenidades tiene?"
 * Multi-select with multiple amenity options
 * Requires Next button
 */
export const AmenitiesStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors } = state;
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    formData.amenities || []
  );

  const handleAmenitiesChange = (amenities: string[]) => {
    setSelectedAmenities(amenities);
  };

  const handleNext = () => {
    updateFormData({ amenities: selectedAmenities });
    nextStep();
  };

  // At least one amenity should be selected, but we can also allow proceeding without any
  const canProceed = true; // Or: selectedAmenities.length > 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        ¿Qué amenidades tiene?
      </h2>

      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Selecciona todas las amenidades disponibles en la propiedad
        </p>

        <MultiSelect
          options={AMENITIES_OPTIONS}
          selected={selectedAmenities}
          onChange={handleAmenitiesChange}
        />

        {selectedAmenities.length === 0 && (
          <p className="text-gray-500 text-sm italic">
            Puedes continuar sin seleccionar amenidades si la propiedad no cuenta con ninguna
          </p>
        )}

        {errors.amenities && (
          <p className="text-red-500 text-sm mt-2">{errors.amenities}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <NavigationButtons
        onBack={previousStep}
        onNext={handleNext}
        disableNext={!canProceed}
      />
    </div>
  );
};