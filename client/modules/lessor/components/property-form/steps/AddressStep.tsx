'use client';

import React, { useState } from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { NavigationButtons } from '../ui';
import { VALIDATION_MESSAGES } from '@/modules/lessor/utils/constants';

/**
 * Step 15: Address Input
 * Question: "Agrega la dirección de tu propiedad"
 */
export const AddressStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors } = state;
  const [address, setAddress] = useState(formData.address || '');
  const [localError, setLocalError] = useState('');

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAddress(value);

    // Clear error when user starts typing
    if (localError && value.length >= 10) {
      setLocalError('');
    }
  };

  const handleNext = () => {
    console.log('[AddressStep] handleNext called');
    console.log('[AddressStep] Local address:', address);
    console.log('[AddressStep] Local address trimmed:', address.trim());
    console.log('[AddressStep] Local address length:', address.trim().length);
    console.log('[AddressStep] Context address:', formData.address);
    console.log('[AddressStep] Context address length:', formData.address?.length);

    const trimmedAddress = address.trim();

    // Validate locally BEFORE updateFormData
    if (!trimmedAddress) {
      console.log('[AddressStep] Validation FAILED: address empty');
      setLocalError(VALIDATION_MESSAGES.INVALID_ADDRESS);
      return;
    }

    if (trimmedAddress.length < 10) {
      console.log('[AddressStep] Validation FAILED: address too short');
      console.log('[AddressStep] Address length:', trimmedAddress.length);
      setLocalError('La dirección debe tener al menos 10 caracteres');
      return;
    }

    console.log('[AddressStep] Validation PASSED, updating context...');

    // Clear local error
    setLocalError('');

    // Save address and proceed
    updateFormData({ address: trimmedAddress });

    // Wait for context to update before advancing
    console.log('[AddressStep] Calling nextStep in 50ms...');
    setTimeout(() => {
      console.log('[AddressStep] Executing nextStep NOW');
      nextStep();
    }, 50);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        Agrega la dirección de tu propiedad
      </h2>

      <p className="text-gray-600">
        Ingresa la dirección completa de tu propiedad. Esta información será visible para los posibles inquilinos.
      </p>

      <div className="space-y-2">
        <label
          htmlFor="address-input"
          className="block text-sm font-medium text-gray-700"
        >
          Dirección completa
        </label>
        <textarea
          id="address-input"
          value={address}
          onChange={handleAddressChange}
          className="w-full px-4 py-3 border-2 border-[#042a5c]/30 rounded-lg focus:border-[#fdd76c] outline-none resize-none transition-colors"
          placeholder="Ej: Av. Universidad 123, Col. Centro, Monterrey, NL"
          rows={3}
          maxLength={300}
        />
        <p className="text-sm text-gray-500">
          {address.length}/300 caracteres
        </p>
      </div>

      {/* Additional address fields could be added here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Código Postal (opcional)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border-2 border-[#042a5c]/30 rounded-lg focus:border-[#fdd76c] outline-none"
            placeholder="64000"
            maxLength={5}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Referencias (opcional)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border-2 border-[#042a5c]/30 rounded-lg focus:border-[#fdd76c] outline-none"
            placeholder="Frente al parque principal"
          />
        </div>
      </div>

      {/* Error message removed - Next button disabled state provides validation feedback */}

      <NavigationButtons
        onBack={previousStep}
        onNext={handleNext}
        disableNext={!address.trim() || address.trim().length < 10}
      />
    </div>
  );
};