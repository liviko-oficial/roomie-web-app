'use client';

import React, { useState } from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { OptionCard, NavigationButtons } from '../ui';
import { CONTRACT_DURATIONS, DEPOSIT_OPTIONS } from '@/modules/lessor/utils/constants';
import type { ContractDuration, DepositType } from '@/modules/lessor/types/property-form.types';

/**
 * Step 12: Contract and Deposit Details
 * Questions 14-16: Contract duration, requirements, and deposit
 * Complex multi-part step with conditional fields
 * Requires Next button
 */
export const ContractStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors } = state;

  // Contract states
  const [contractDuration, setContractDuration] = useState<ContractDuration | null>(
    formData.contractDuration || null
  );
  const [customMonths, setCustomMonths] = useState<number>(
    formData.customDurationMonths || 12
  );
  const [requiresGuarantor, setRequiresGuarantor] = useState<boolean>(
    formData.requiresGuarantor || false
  );
  const [requiresAlternativeJustice, setRequiresAlternativeJustice] = useState<boolean>(
    formData.requiresAlternativeJustice || false
  );

  // Deposit states
  const [depositType, setDepositType] = useState<DepositType | null>(
    formData.depositType || null
  );
  const [customDeposit, setCustomDeposit] = useState<number>(
    formData.customDepositAmount || (formData.monthlyRent || 5000)
  );

  const handleContractSelect = (value: ContractDuration) => {
    setContractDuration(value);
    // Reset requirements if not one year
    if (value !== 'one_year') {
      setRequiresGuarantor(false);
      setRequiresAlternativeJustice(false);
    }
  };

  const handleDepositSelect = (value: DepositType) => {
    setDepositType(value);
  };

  const handleNext = () => {
    console.log('[ContractStep] handleNext called');
    console.log('[ContractStep] Local duration:', contractDuration);
    console.log('[ContractStep] Local deposit:', depositType);
    console.log('[ContractStep] Context duration:', formData.contractDuration);
    console.log('[ContractStep] Context deposit:', formData.depositType);

    // Validate locally BEFORE updateFormData
    if (!contractDuration) {
      console.log('[ContractStep] Validation FAILED: no duration selected');
      return;
    }

    if (!depositType) {
      console.log('[ContractStep] Validation FAILED: no deposit selected');
      return;
    }

    console.log('[ContractStep] Validation PASSED, updating context...');

    const updates: any = {
      contractDuration,
      depositType
    };

    // Add custom duration if applicable
    if (contractDuration === 'custom') {
      updates.customDurationMonths = customMonths;
    }

    // Add requirements if one year contract
    if (contractDuration === 'one_year') {
      updates.requiresGuarantor = requiresGuarantor;
      updates.requiresAlternativeJustice = requiresAlternativeJustice;
    }

    // Add custom deposit if applicable
    if (depositType === 'custom') {
      updates.customDepositAmount = customDeposit;
    }

    updateFormData(updates);

    // Wait for context to update before advancing
    console.log('[ContractStep] Calling nextStep in 50ms...');
    setTimeout(() => {
      console.log('[ContractStep] Executing nextStep NOW');
      nextStep();
    }, 50);
  };

  const canProceed = contractDuration !== null && depositType !== null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Contract Duration Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#042a5c]">
          Duración del contrato
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CONTRACT_DURATIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={contractDuration === option.value}
              onClick={() => handleContractSelect(option.value as ContractDuration)}
            />
          ))}
        </div>

        {/* Custom duration input */}
        {contractDuration === 'custom' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración personalizada (meses)
            </label>
            <input
              type="number"
              value={customMonths}
              onChange={(e) => setCustomMonths(Math.max(1, Math.min(24, Number(e.target.value))))}
              min="1"
              max="24"
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdd76c] focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Entre 1 y 24 meses</p>
          </div>
        )}

        {/* Requirements for 1-year contract */}
        {contractDuration === 'one_year' && (
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Requisitos para contrato de 1 año:
            </p>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresGuarantor}
                onChange={(e) => setRequiresGuarantor(e.target.checked)}
                className="w-4 h-4 text-[#fdd76c] border-gray-300 rounded focus:ring-[#fdd76c]"
              />
              <span className="text-sm">Requiere aval</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresAlternativeJustice}
                onChange={(e) => setRequiresAlternativeJustice(e.target.checked)}
                className="w-4 h-4 text-[#fdd76c] border-gray-300 rounded focus:ring-[#fdd76c]"
              />
              <span className="text-sm">Requiere justicia alternativa</span>
            </label>
          </div>
        )}

        {/* Error message removed - Next button disabled state provides validation feedback */}
      </div>

      {/* Deposit Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#042a5c]">
          Monto del depósito
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEPOSIT_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={depositType === option.value}
              onClick={() => handleDepositSelect(option.value as DepositType)}
            />
          ))}
        </div>

        {/* Custom deposit input */}
        {depositType === 'custom' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto del depósito
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                value={customDeposit}
                onChange={(e) => setCustomDeposit(Math.max(0, Number(e.target.value)))}
                min="0"
                className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdd76c] focus:border-transparent outline-none"
              />
              <span className="text-gray-500">MXN</span>
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