'use client';

import React, { useState } from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { OptionCard, NavigationButtons } from '../ui';

/**
 * Step 8-9: Parking Availability and Spots
 * Questions: "¿Tiene estacionamiento?" and if yes, number of spots
 * Requires Next button
 */
export const ParkingStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors } = state;
  const [hasParking, setHasParking] = useState<boolean | null>(
    formData.hasParking || null
  );
  const [parkingSpots, setParkingSpots] = useState<number>(
    formData.parkingSpots || 1
  );

  const handleParkingSelect = (value: boolean) => {
    setHasParking(value);
    if (!value) {
      // Reset parking spots if no parking
      setParkingSpots(1);
    }
  };

  const handleSpotsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParkingSpots(Number(e.target.value));
  };

  const handleNext = () => {
    const updates: any = {
      hasParking: hasParking || false
    };

    if (hasParking === true) {
      updates.parkingSpots = parkingSpots;
    }

    updateFormData(updates);
    nextStep();
  };

  const canProceed = hasParking !== null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        ¿Tiene estacionamiento?
      </h2>

      <div className="space-y-6">
        {/* Parking Yes/No */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OptionCard
            label="Sí"
            selected={hasParking === true}
            onClick={() => handleParkingSelect(true)}
          />
          <OptionCard
            label="No"
            selected={hasParking === false}
            onClick={() => handleParkingSelect(false)}
          />
        </div>

        {/* Parking Spots Selector - Only show if hasParking is true */}
        {hasParking === true && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cuántos lugares de estacionamiento?
            </label>
            <select
              value={parkingSpots}
              onChange={handleSpotsChange}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdd76c] focus:border-transparent outline-none bg-white"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'lugar' : 'lugares'}
                </option>
              ))}
            </select>
          </div>
        )}

        {errors.hasParking && (
          <p className="text-red-500 text-sm">{errors.hasParking}</p>
        )}
        {errors.parkingSpots && hasParking && (
          <p className="text-red-500 text-sm">{errors.parkingSpots}</p>
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