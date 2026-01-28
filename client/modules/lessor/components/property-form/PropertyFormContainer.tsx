'use client';

import React from 'react';
import { PropertyFormProvider } from '@/modules/lessor/context/PropertyFormContext';
import { usePropertyForm } from '@/modules/lessor/hooks/usePropertyForm';
import { FormProgressBar } from './ui';
import {
  PropertyTypeStep,
  RentalTypeStep,
  GenderPreferenceStep,
  PriceServicesStep,
  ServicesSelectionStep,
  FurnishedStep,
  CommonSpacesStep,
  ParkingStep,
  PetFriendlyStep,
  AmenitiesStep,
  SecurityStep,
  ContractStep,
  RoomCountStep,
  RoomDetailStep,
  AddressStep,
  LocationMapStep,
  DistanceStep,
  PropertyPhotosStep,
  ReviewStep,
} from './steps';

/**
 * FormProgressBarWrapper Component
 * Wrapper to connect FormProgressBar to context
 */
const FormProgressBarWrapper = () => {
  const { state } = usePropertyForm();
  const { currentStep = 1, totalSteps = 13 } = state;

  // NaN protection
  const safeCurrentStep = currentStep || 1;
  const safeTotalSteps = totalSteps || 13;

  return (
    <FormProgressBar
      currentStep={safeCurrentStep}
      totalSteps={safeTotalSteps}
    />
  );
};

/**
 * StepRenderer Component
 * Renders the appropriate step based on current form state
 */
const StepRenderer = () => {
  const { state } = usePropertyForm();
  const { currentStep, flowType, formData } = state;

  // FLUJO SINGLE - Propiedad completa
  if (flowType === 'single') {
    switch (currentStep) {
      case 1: return <PropertyTypeStep />;
      case 2: return <RentalTypeStep />;
      case 3: return <GenderPreferenceStep />;
      case 4: return <PriceServicesStep />;
      case 5:
        // IMPORTANTE: Solo mostrar ServicesSelectionStep si includesServices tiene datos
        // Si es un array vacío, significa que seleccionó "No"
        if (formData.includedServices && formData.includedServices.length === 0) {
          // Seleccionó "No" - saltar a FurnishedStep
          return <FurnishedStep />;
        }
        // Seleccionó "Sí" - mostrar selección de servicios
        return <ServicesSelectionStep />;
      case 6:
        // Si NO incluyó servicios, este es CommonSpacesStep
        // Si SÍ incluyó servicios, este es FurnishedStep
        if (formData.includedServices && formData.includedServices.length === 0) {
          return <CommonSpacesStep />;
        }
        return <FurnishedStep />;
      case 7:
        // Ajustar según si saltó o no el step 5
        if (formData.includedServices && formData.includedServices.length === 0) {
          return <ParkingStep />;
        }
        return <CommonSpacesStep />;
      case 8:
        if (formData.includedServices && formData.includedServices.length === 0) {
          return <PetFriendlyStep />;
        }
        return <ParkingStep />;
      case 9:
        if (formData.includedServices && formData.includedServices.length === 0) {
          return <AmenitiesStep />;
        }
        return <PetFriendlyStep />;
      case 10:
        if (formData.includedServices && formData.includedServices.length === 0) {
          return <SecurityStep />;
        }
        return <AmenitiesStep />;
      case 11:
        if (formData.includedServices && formData.includedServices.length === 0) {
          return <ContractStep />;
        }
        return <SecurityStep />;
      case 12:
        if (formData.includedServices && formData.includedServices.length === 0) {
          return <AddressStep />;
        }
        return <ContractStep />;
      case 13:
        if (formData.includedServices && formData.includedServices.length === 0) {
          return <LocationMapStep />;
        }
        return <AddressStep />;
      case 14:
        if (formData.includedServices && formData.includedServices.length === 0) {
          return <DistanceStep />;
        }
        return <LocationMapStep />;
      case 15:
        if (formData.includedServices && formData.includedServices.length === 0) {
          return <PropertyPhotosStep />;
        }
        return <DistanceStep />;
      case 16:
        if (formData.includedServices && formData.includedServices.length === 0) {
          return <ReviewStep />;
        }
        return <PropertyPhotosStep />;
      case 17:
        return <ReviewStep />;
      default:
        return <ReviewStep />;
    }
  }

  // FLUJO MULTIPLE - Habitaciones
  if (flowType === 'multiple') {
    if (currentStep === 1) return <PropertyTypeStep />;
    if (currentStep === 2) return <RentalTypeStep />;
    if (currentStep === 3) return <RoomCountStep />;

    const totalRooms = formData.rooms?.length || 0;
    const roomStepsEnd = 3 + totalRooms;

    // Steps de habitaciones individuales
    if (currentStep > 3 && currentStep <= roomStepsEnd) {
      const roomIndex = currentStep - 4;
      return <RoomDetailStep roomIndex={roomIndex} />;
    }

    // Calcular offset para steps restantes
    const remainingStepOffset = currentStep - roomStepsEnd;

    switch (remainingStepOffset) {
      case 1: return <AddressStep />;
      case 2: return <LocationMapStep />;
      case 3: return <ParkingStep />;
      case 4: return <PetFriendlyStep />;
      case 5: return <ContractStep />;
      case 6: return <DistanceStep />;
      case 7: return <ReviewStep />;
      default: return <ReviewStep />;
    }
  }

  return <ReviewStep />;
};

/**
 * PropertyFormContainer Component
 * Main container for the property registration form
 */
export const PropertyFormContainer = () => {
  return (
    <PropertyFormProvider>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-[#042a5c] text-white">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Registra tu propiedad</h1>
            <p className="text-white/90 mt-2">
              Completa el formulario para publicar tu propiedad en Happy Roomie
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border-b border-[#042a5c]/10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <FormProgressBarWrapper />
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-[#042a5c]/10 shadow-sm p-6 md:p-8">
            <StepRenderer />
          </div>
        </div>

        {/* Optional Footer Info */}
        <div className="max-w-2xl mx-auto px-4 pb-8">
          <div className="text-center text-sm text-[#042a5c]/60">
            <p>¿Necesitas ayuda? Contáctanos en soporte@happyroomie.com</p>
          </div>
        </div>
      </div>
    </PropertyFormProvider>
  );
};

export default PropertyFormContainer;