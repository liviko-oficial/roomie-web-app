'use client';

import React, { useState } from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { MultiSelect, NavigationButtons } from '../ui';
import { COMMON_SPACES_OPTIONS } from '@/modules/lessor/utils/constants';

/**
 * Step 7: Common Spaces Selection
 * Question: "¿Qué espacios comunes tiene?"
 * Multi-select with "Otro" option that shows text input
 * Requires Next button
 */
export const CommonSpacesStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors } = state;
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>(
    formData.commonSpaces || []
  );
  const [otherSpace, setOtherSpace] = useState<string>(
    formData.otherCommonSpace || ''
  );
  const [showOtherInput, setShowOtherInput] = useState(
    formData.commonSpaces?.includes('other') || false
  );

  const handleSpacesChange = (spaces: string[]) => {
    setSelectedSpaces(spaces);

    // Check if "other" is selected
    const hasOther = spaces.includes('other');
    setShowOtherInput(hasOther);

    // Clear other space text if "other" is deselected
    if (!hasOther) {
      setOtherSpace('');
    }
  };

  const handleNext = () => {
    const updates: any = {
      commonSpaces: selectedSpaces
    };

    if (showOtherInput && otherSpace.trim()) {
      updates.otherCommonSpace = otherSpace.trim();
    } else {
      // Clear otherCommonSpace if not using "Otro"
      updates.otherCommonSpace = '';
    }

    updateFormData(updates);
    nextStep();
  };

  // Allow proceeding even with no spaces selected
  // Only require text input if "Otro" is selected
  const canProceed = !showOtherInput || (showOtherInput && otherSpace.trim().length > 0);

  // Add "Otro" option to the existing options
  const optionsWithOther = [
    ...COMMON_SPACES_OPTIONS,
    { value: 'other', label: 'Otro' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        ¿Qué espacios comunes tiene?
      </h2>

      <div className="space-y-4">
        <MultiSelect
          options={optionsWithOther}
          selected={selectedSpaces}
          onChange={handleSpacesChange}
        />

        {/* Show text input if "Otro" is selected */}
        {showOtherInput && (
          <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-[#042a5c] mb-2">
              ¿Cuál espacio común? *
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Describe el espacio común que no aparece en la lista
            </p>
            <input
              type="text"
              value={otherSpace}
              onChange={(e) => setOtherSpace(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#042a5c]/30 rounded-lg focus:border-[#fdd76c] outline-none"
              placeholder="Ej: Sala de juegos, Roof garden, etc."
            />
          </div>
        )}

        {errors.commonSpaces && (
          <p className="text-red-500 text-sm mt-2">{errors.commonSpaces}</p>
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