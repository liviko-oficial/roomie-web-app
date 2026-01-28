'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePropertyForm } from '@/modules/lessor';
import {
  PROPERTY_TYPES,
  RENTAL_TYPES,
  GENDER_OPTIONS,
  SERVICES_OPTIONS,
  COMMON_SPACES_OPTIONS,
  AMENITIES_OPTIONS,
  FURNITURE_OPTIONS,
  BATHROOM_OPTIONS,
  CONTRACT_DURATIONS,
  DEPOSIT_OPTIONS
} from '@/modules/lessor/utils/constants';

/**
 * Step 18: Review and Submit
 * Final step showing summary of all entered data
 */
export const ReviewStep: React.FC = () => {
  const router = useRouter();
  const {
    state,
    previousStep,
    submitForm
  } = usePropertyForm();

  const { formData, flowType } = state;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: API call will be added later
      console.log('Form data to submit:', formData);
      await submitForm();
      setSubmitSuccess(true);

      // Redirect to success page
      setTimeout(() => {
        router.push('/registro-propiedad/exito');
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error al registrar la propiedad. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get label from options
  const getLabel = (value: string | null, options: any[]) => {
    if (!value) return 'No especificado';
    const option = options.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#042a5c]">
          Revisa y confirma tu información
        </h2>
        <p className="text-gray-600 mt-2">
          Por favor revisa que toda la información sea correcta antes de registrar tu propiedad.
        </p>
      </div>

      {/* Summary sections */}
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#042a5c] mb-4">
            Información Básica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Tipo de propiedad</p>
              <p className="font-medium">{getLabel(formData.propertyType, PROPERTY_TYPES)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo de renta</p>
              <p className="font-medium">{getLabel(formData.rentalType, RENTAL_TYPES)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Preferencia de género</p>
              <p className="font-medium">{getLabel(formData.genderPreference, GENDER_OPTIONS)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dirección</p>
              <p className="font-medium">{formData.address || 'No especificada'}</p>
            </div>
          </div>
        </div>

        {/* Pricing and Services */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#042a5c] mb-4">
            Precio y Servicios
          </h3>
          <div className="space-y-4">
            {flowType === 'single' ? (
              <div>
                <p className="text-sm text-gray-600">Renta mensual</p>
                <p className="text-2xl font-semibold text-[#042a5c]">
                  {formData.monthlyRent ? formatPrice(formData.monthlyRent) : 'No especificado'}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">Habitaciones configuradas</p>
                <p className="font-medium">{formData.rooms?.length || 0} habitaciones</p>
                {formData.rooms?.map((room, index) => (
                  <div key={room.id} className="ml-4 mt-2 p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Habitación {index + 1}</p>
                    <p className="text-sm text-gray-600">
                      Precio: {formatPrice(room.price)} •
                      Género: {getLabel(room.genderPreference, GENDER_OPTIONS)} •
                      Baño: {getLabel(room.bathroomType, BATHROOM_OPTIONS)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Servicios: {room.includedServices && room.includedServices.length > 0 ? 'Incluidos' : 'No incluidos'}
                      {room.includedServices && room.includedServices.length === 0 && room.estimatedServicesCost && (
                        <span> (estimado: {formatPrice(room.estimatedServicesCost)}/mes)</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Services Section - Always show */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Incluye servicios</p>
                  <p className="font-medium">
                    {formData.includedServices && formData.includedServices.length > 0 ? 'Sí' : 'No'}
                  </p>
                </div>

                {/* If services NOT included, show estimated cost */}
                {formData.includedServices && formData.includedServices.length === 0 && formData.estimatedServicesCost && (
                  <div>
                    <p className="text-sm text-gray-600">Servicios estimados</p>
                    <p className="font-medium text-[#042a5c]">
                      {formatPrice(formData.estimatedServicesCost)} / mes
                    </p>
                  </div>
                )}
              </div>

              {/* If services ARE included, show list */}
              {formData.includedServices && formData.includedServices.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Servicios incluidos:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.includedServices.map(service => (
                      <span key={service} className="px-3 py-1 bg-[#fdd76c]/20 text-[#042a5c] text-sm rounded-full">
                        {getLabel(service, SERVICES_OPTIONS)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Property Features */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#042a5c] mb-4">
            Características de la Propiedad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Amueblado</p>
              <p className="font-medium">{formData.isFurnished ? 'Sí' : 'No'}</p>
              {formData.isFurnished && formData.furnitureItems && formData.furnitureItems.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {formData.furnitureItems.length} items de mobiliario
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Acepta mascotas</p>
              <p className="font-medium">{formData.isPetFriendly ? 'Sí' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estacionamiento</p>
              <p className="font-medium">
                {formData.hasParking ? `Sí${formData.parkingSpots ? ` (${formData.parkingSpots} lugares)` : ''}` : 'No'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Seguridad privada</p>
              <p className="font-medium">{formData.hasSecurity ? 'Sí' : 'No'}</p>
            </div>
          </div>

          {/* Common Spaces */}
          {formData.commonSpaces.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Espacios comunes</p>
              <div className="flex flex-wrap gap-2">
                {formData.commonSpaces.map(space => {
                  // Show "Otro" label with custom text if available
                  if (space === 'other' && formData.otherCommonSpace) {
                    return (
                      <span key={space} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        Otro: {formData.otherCommonSpace}
                      </span>
                    );
                  }
                  return (
                    <span key={space} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {getLabel(space, COMMON_SPACES_OPTIONS)}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Amenities */}
          {formData.amenities.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Amenidades</p>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map(amenity => (
                  <span key={amenity} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {getLabel(amenity, AMENITIES_OPTIONS)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contract and Deposit */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#042a5c] mb-4">
            Contrato y Depósito
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Duración del contrato</p>
              <p className="font-medium">{getLabel(formData.contractDuration, CONTRACT_DURATIONS)}</p>
              {formData.contractDuration === 'custom' && formData.customDurationMonths && (
                <p className="text-sm text-gray-500">{formData.customDurationMonths} meses</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Depósito requerido</p>
              <p className="font-medium">{getLabel(formData.depositType, DEPOSIT_OPTIONS)}</p>
              {formData.depositType === 'custom' && formData.customDepositAmount && (
                <p className="text-sm text-gray-500">{formatPrice(formData.customDepositAmount)}</p>
              )}
            </div>
            {formData.requiresGuarantor && (
              <div>
                <p className="text-sm text-gray-600">Requiere aval</p>
                <p className="font-medium">Sí</p>
              </div>
            )}
            {formData.requiresAlternativeJustice && (
              <div>
                <p className="text-sm text-gray-600">Justicia alternativa</p>
                <p className="font-medium">Sí</p>
              </div>
            )}
          </div>
        </div>

        {/* Distance to Campus */}
        {(formData.walkingDistanceMinutes || formData.drivingDistanceMinutes) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#042a5c] mb-4">
              Distancia al Campus
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.walkingDistanceMinutes && (
                <div>
                  <p className="text-sm text-gray-600">Tiempo caminando</p>
                  <p className="font-medium">{formData.walkingDistanceMinutes} minutos</p>
                </div>
              )}
              {formData.drivingDistanceMinutes && (
                <div>
                  <p className="text-sm text-gray-600">Tiempo en carro</p>
                  <p className="font-medium">{formData.drivingDistanceMinutes} minutos</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Property Photos - COMPLETO flow only */}
        {flowType === 'single' && formData.photos && formData.photos.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#042a5c] mb-4">
              Fotos de la Propiedad
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📸</span>
              <p className="font-medium text-[#042a5c]">
                {formData.photos.length} {formData.photos.length === 1 ? 'foto' : 'fotos'} cargadas
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Las fotos se mostrarán a los inquilinos interesados en tu propiedad
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
        <button
          onClick={previousStep}
          className="flex-1 px-6 py-3 border-2 border-[#042a5c] text-[#042a5c] rounded-lg hover:bg-gray-50 transition-colors font-medium"
          disabled={isSubmitting}
        >
          Volver a revisar
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-6 py-3 bg-[#fdd76c] text-[#042a5c] rounded-lg hover:bg-[#fdd76c]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Registrar Propiedad'}
        </button>
      </div>

      {/* Success message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-green-800">
              ¡Tu propiedad se ha registrado exitosamente!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};