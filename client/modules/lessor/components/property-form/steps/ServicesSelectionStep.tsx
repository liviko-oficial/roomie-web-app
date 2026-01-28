'use client';

import React, { useEffect, useState } from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { MultiSelect, NavigationButtons } from '../ui';
import { SERVICES_OPTIONS } from '@/modules/lessor/utils/constants';

/**
 * Step 5b: Services Selection
 * Question: "¿Qué servicios están incluidos?"
 * CONDITIONAL: Only renders if formData.includesServices === true
 * Requires Next button
 */
export const ServicesSelectionStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors } = state;
  const [selectedServices, setSelectedServices] = useState<string[]>(
    formData.includedServices || []
  );

  const handleServicesChange = (services: string[]) => {
    setSelectedServices(services);
  };

  const handleSelectAll = () => {
    const allServiceValues = SERVICES_OPTIONS.map(opt => opt.value);
    setSelectedServices(allServiceValues);
  };

  const handleNext = () => {
    updateFormData({ includedServices: selectedServices });
    nextStep();
  };

  const canProceed = selectedServices.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        ¿Qué servicios están incluidos?
      </h2>

      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm text-[#042a5c] hover:underline"
          >
            Seleccionar todos los servicios
          </button>
        </div>

        <MultiSelect
          options={SERVICES_OPTIONS}
          selected={selectedServices}
          onChange={handleServicesChange}
        />

        {errors.includedServices && (
          <p className="text-red-500 text-sm mt-2">{errors.includedServices}</p>
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