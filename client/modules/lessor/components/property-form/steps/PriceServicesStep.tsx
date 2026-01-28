'use client';

import React, { useState } from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { OptionCard, PriceSlider, NavigationButtons } from '../ui';

/**
 * Step 4-5: Price and Services
 * Questions: Monthly price + "¿Incluye servicios?"
 * Requires Next button (no auto-advance)
 */
export const PriceServicesStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors } = state;

  // Local state for price to prevent excessive updates
  const [localPrice, setLocalPrice] = useState(formData.monthlyRent || 5000);
  const [includesServices, setIncludesServices] = useState<boolean | null>(
    (formData.includedServices?.length ?? 0) > 0 ? true : null
  );
  const [estimatedServicesCost, setEstimatedServicesCost] = useState<number>(
    formData.estimatedServicesCost || 0
  );

  const handlePriceChange = (value: number) => {
    setLocalPrice(value);
  };

  const handleServicesSelect = (value: boolean) => {
    setIncludesServices(value);
  };

  const handleNext = () => {
    console.log('[PriceServicesStep] handleNext called');
    console.log('[PriceServicesStep] Local price:', localPrice);
    console.log('[PriceServicesStep] Context price:', formData.monthlyRent);
    console.log('[PriceServicesStep] Include services:', includesServices);
    console.log('[PriceServicesStep] Estimated services cost:', estimatedServicesCost);

    // Validate locally BEFORE updateFormData
    if (!localPrice || localPrice <= 0) {
      console.log('[PriceServicesStep] Validation FAILED: invalid price');
      return;
    }

    if (includesServices === null) {
      console.log('[PriceServicesStep] Validation FAILED: services not selected');
      return;
    }

    // If services NOT included, validate estimated cost
    if (includesServices === false && (!estimatedServicesCost || estimatedServicesCost <= 0)) {
      console.log('[PriceServicesStep] Validation FAILED: estimated services cost required');
      return;
    }

    console.log('[PriceServicesStep] Validation PASSED, updating context...');

    // Update fields before validation
    updateFormData({
      monthlyRent: localPrice,
      // Store whether services are included as a marker for conditional step
      // If true, includedServices will stay as current value or be set in next step
      // If false, set to empty array to indicate no services AND save estimated cost
      ...(includesServices === false
        ? { includedServices: [], estimatedServicesCost }
        : { estimatedServicesCost: undefined } // Clear if services ARE included
      )
    });

    // Use setTimeout to ensure state updates before advancing
    console.log('[PriceServicesStep] Calling nextStep in 50ms...');
    setTimeout(() => {
      console.log('[PriceServicesStep] Executing nextStep NOW');
      nextStep();
    }, 50);
  };

  const canProceed = localPrice > 0 &&
    includesServices !== null &&
    // If services NOT included, estimated cost must be > 0
    (includesServices === true || (includesServices === false && estimatedServicesCost > 0));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Price Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#042a5c]">
          ¿Cuál es el precio mensual?
        </h2>

        <PriceSlider
          value={localPrice}
          onChange={handlePriceChange}
          min={0}
          max={100000}
          step={500}
          label="Precio mensual"
        />

        {/* Error message removed - Next button disabled state provides validation feedback */}
      </div>

      {/* Services Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#042a5c]">
          ¿El precio incluye servicios?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OptionCard
            label="Sí"
            selected={includesServices === true}
            onClick={() => handleServicesSelect(true)}
          />
          <OptionCard
            label="No"
            selected={includesServices === false}
            onClick={() => handleServicesSelect(false)}
          />
        </div>

        {/* Conditional: Estimated Services Cost when NOT included */}
        {includesServices === false && (
          <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <label htmlFor="estimated-services" className="block text-sm font-medium text-[#042a5c] mb-2">
              Monto estimado mensual de servicios *
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Indica el monto aproximado que los inquilinos pagan por servicios (agua, luz, gas, internet, etc.)
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-lg">$</span>
              <input
                id="estimated-services"
                type="number"
                value={estimatedServicesCost || ''}
                onChange={(e) => setEstimatedServicesCost(Number(e.target.value))}
                min="0"
                step="100"
                className="w-full px-4 py-2 border-2 border-[#042a5c]/30 rounded-lg focus:border-[#fdd76c] outline-none"
                placeholder="Ej: 1500"
              />
              <span className="text-gray-500">MXN / mes</span>
            </div>
          </div>
        )}

        {/* Error message removed - Next button disabled state provides validation feedback */}
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