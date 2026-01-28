'use client';

import React, { useState, useEffect } from 'react';
import { usePropertyForm } from '@/modules/lessor';
import {
  OptionCard,
  MultiSelect,
  NavigationButtons,
  PriceSlider,
  FileUpload
} from '../ui';
import {
  BATHROOM_OPTIONS,
  FURNITURE_OPTIONS,
  SERVICES_OPTIONS,
  GENDER_OPTIONS,
  FORM_CONFIG
} from '@/modules/lessor/utils/constants';
import type {
  BathroomType,
  GenderPreference
} from '@/modules/lessor/types/property-form.types';

interface RoomDetailStepProps {
  roomIndex: number;
}

/**
 * Step 14: Room Detail Collection
 * Collects details for each room individually in multi-room flow
 * Dynamically shows room N of M
 */
export const RoomDetailStep: React.FC<RoomDetailStepProps> = ({ roomIndex }) => {
  const {
    state,
    updateRoom,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData, errors, flowType } = state;
  const currentRoom = formData.rooms?.[roomIndex];
  const totalRooms = formData.rooms?.length || 0;

  // Local state for room details
  const [isFurnished, setIsFurnished] = useState(currentRoom?.isFurnished || false);
  const [furnitureItems, setFurnitureItems] = useState<string[]>(currentRoom?.furnitureItems || []);
  const [bathroomType, setBathroomType] = useState<BathroomType | null>(currentRoom?.bathroomType || null);
  const [photos, setPhotos] = useState<File[]>(currentRoom?.photos || []);
  const [genderPreference, setGenderPreference] = useState<GenderPreference | null>(currentRoom?.genderPreference || null);
  const [price, setPrice] = useState(currentRoom?.price || 3000);
  const [hasServices, setHasServices] = useState((currentRoom?.includedServices?.length || 0) > 0);
  const [includedServices, setIncludedServices] = useState<string[]>(currentRoom?.includedServices || []);
  const [estimatedServicesCost, setEstimatedServicesCost] = useState<number>(currentRoom?.estimatedServicesCost || 0);

  // Update local state when roomIndex changes
  useEffect(() => {
    console.log('[RoomDetailStep useEffect] roomIndex changed to:', roomIndex);
    const room = formData.rooms?.[roomIndex];
    console.log('[RoomDetailStep useEffect] Room data from context:', room);

    if (room) {
      // Load saved data from context, or use fresh defaults
      setIsFurnished(room.isFurnished || false);
      setFurnitureItems(room.furnitureItems || []);
      setBathroomType(room.bathroomType || null);
      setPhotos(room.photos || []); // This is causing the reset
      setGenderPreference(room.genderPreference || null);
      setPrice(room.price || 3000);
      setHasServices((room.includedServices?.length || 0) > 0);
      setIncludedServices(room.includedServices || []);
      setEstimatedServicesCost(room.estimatedServicesCost || 0);

      console.log('[RoomDetailStep useEffect] State reset to:', {
        photos: room.photos?.length || 0,
        bathroomType: room.bathroomType,
        genderPreference: room.genderPreference,
        estimatedServicesCost: room.estimatedServicesCost || 0
      });
    }
  }, [roomIndex]);

  // Debug: Log when photos change
  useEffect(() => {
    console.log('[RoomDetailStep] Photos state updated:', photos.length, photos);
    console.log('[RoomDetailStep] Full state after photo change:', {
      photos: photos.length,
      bathroomType,
      genderPreference,
      price,
      hasServices,
      includedServices: includedServices.length
    });
  }, [photos, bathroomType, genderPreference, price, hasServices, includedServices]);

  const handleNext = () => {
    console.log('[RoomDetailStep] handleNext called');
    console.log('[RoomDetailStep] Room index:', roomIndex);
    console.log('[RoomDetailStep] Total rooms:', totalRooms);
    console.log('[RoomDetailStep] Room data:', {
      genderPreference,
      price,
      hasServices,
      includedServices: includedServices.length,
      isFurnished,
      bathroomType,
      photos: photos.length,
      photoFiles: photos
    });

    // Save current room data
    if (updateRoom) {
      console.log('[RoomDetailStep] Saving room data to context...');
      updateRoom(roomIndex, 'isFurnished', isFurnished);
      updateRoom(roomIndex, 'furnitureItems', isFurnished ? furnitureItems : []);
      updateRoom(roomIndex, 'bathroomType', bathroomType);
      updateRoom(roomIndex, 'photos', photos);
      updateRoom(roomIndex, 'genderPreference', genderPreference);
      updateRoom(roomIndex, 'price', price);
      updateRoom(roomIndex, 'includedServices', hasServices ? includedServices : []);
      updateRoom(roomIndex, 'estimatedServicesCost', hasServices ? undefined : estimatedServicesCost);
      console.log('[RoomDetailStep] Room data saved, photos count:', photos.length);
    }

    // Wait for context to update before advancing
    console.log('[RoomDetailStep] Calling nextStep in 50ms...');
    setTimeout(() => {
      console.log('[RoomDetailStep] Executing nextStep NOW');
      // Check if there are more rooms to configure
      if (roomIndex < totalRooms - 1) {
        console.log('[RoomDetailStep] Moving to next room...');
        nextStep(); // This should stay on same step but with next room
      } else {
        console.log('[RoomDetailStep] All rooms configured, moving to next step...');
        nextStep();
      }
    }, 50);
  };

  const isFormValid = () => {
    const valid = bathroomType !== null &&
                  photos.length >= 1 &&
                  genderPreference !== null &&
                  price > 0 &&
                  (hasServices ? includedServices.length > 0 : estimatedServicesCost > 0);

    console.log('[RoomDetailStep] isFormValid called at:', new Date().toISOString());
    console.log('[RoomDetailStep] isFormValid check:', {
      bathroomType: bathroomType !== null,
      bathroomTypeValue: bathroomType,
      photos: photos.length >= 1,
      photosLength: photos.length,
      photosArray: photos,
      genderPreference: genderPreference !== null,
      genderPreferenceValue: genderPreference,
      price: price > 0,
      priceValue: price,
      services: hasServices ? includedServices.length > 0 : estimatedServicesCost > 0,
      hasServices,
      includedServicesLength: includedServices.length,
      estimatedServicesCost,
      finalResult: valid
    });

    return valid;
  };

  // Log the validation result whenever any dependency changes
  useEffect(() => {
    console.log('[RoomDetailStep] State changed, validation result:', isFormValid());
  }, [photos, bathroomType, genderPreference, price, hasServices, includedServices, estimatedServicesCost]);

  // Only show for multi-room flow
  if (flowType !== 'multiple' || !currentRoom) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#042a5c]">
          Habitación {roomIndex + 1} de {totalRooms}
        </h2>
        <p className="text-gray-600 mt-2">
          Configura los detalles de esta habitación
        </p>
      </div>

      {/* Gender preference for room */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-[#042a5c]">
          Preferencia de género para esta habitación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GENDER_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={genderPreference === option.value}
              onClick={() => setGenderPreference(option.value as GenderPreference)}
            />
          ))}
        </div>
      </div>

      {/* Monthly price for room */}
      <div className="space-y-3">
        <PriceSlider
          label="Precio mensual de la habitación"
          value={price}
          onChange={setPrice}
          min={FORM_CONFIG.MIN_PRICE}
          max={FORM_CONFIG.MAX_PRICE}
          step={100}
        />
      </div>

      {/* Services included */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-[#042a5c]">
          ¿El precio incluye servicios?
        </h3>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <OptionCard
            label="Sí"
            selected={hasServices}
            onClick={() => setHasServices(true)}
          />
          <OptionCard
            label="No"
            selected={!hasServices}
            onClick={() => setHasServices(false)}
          />
        </div>

        {hasServices && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#042a5c] mb-2">
              Selecciona los servicios incluidos
            </label>
            <MultiSelect
              options={SERVICES_OPTIONS}
              selected={includedServices}
              onChange={setIncludedServices}
            />
          </div>
        )}

        {/* Conditional: Estimated Services Cost when NOT included */}
        {!hasServices && (
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
      </div>

      {/* Is furnished? */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-[#042a5c]">
          ¿La habitación está amueblada?
        </h3>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <OptionCard
            label="Sí"
            selected={isFurnished}
            onClick={() => setIsFurnished(true)}
          />
          <OptionCard
            label="No"
            selected={!isFurnished}
            onClick={() => setIsFurnished(false)}
          />
        </div>

        {isFurnished && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#042a5c] mb-2">
              Selecciona los muebles incluidos
            </label>
            <MultiSelect
              options={FURNITURE_OPTIONS}
              selected={furnitureItems}
              onChange={setFurnitureItems}
            />
          </div>
        )}
      </div>

      {/* Bathroom type */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-[#042a5c]">
          Tipo de baño
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BATHROOM_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={bathroomType === option.value}
              onClick={() => setBathroomType(option.value as BathroomType)}
            />
          ))}
        </div>
      </div>

      {/* Room photos */}
      <div className="space-y-3">
        {/* Visual indicator - shows which room user is configuring */}
        <div className="bg-[#fdd76c]/20 border-2 border-[#fdd76c] rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📸</span>
              <div>
                <p className="font-semibold text-[#042a5c] text-lg">
                  Habitación {roomIndex + 1} de {totalRooms}
                </p>
                <p className="text-sm text-gray-600">
                  {roomIndex < totalRooms - 1
                    ? `Después de subir fotos, configurarás la habitación ${roomIndex + 2}`
                    : 'Esta es la última habitación'}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-1">
              {Array.from({ length: totalRooms }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    idx < roomIndex
                      ? 'bg-green-500 text-white'
                      : idx === roomIndex
                      ? 'bg-[#fdd76c] text-[#042a5c]'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {idx < roomIndex ? '✓' : idx + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium text-[#042a5c]">
          Fotos de la habitación
        </h3>
        <p className="text-sm text-gray-600">
          Sube al menos 1 foto de esta habitación (máximo 5)
        </p>
        <FileUpload
          onFilesSelected={setPhotos}
          maxFiles={5}
          accept="image/*"
          multiple
        />
      </div>

      {errors[`room_${roomIndex}`] && (
        <p className="text-red-500 text-sm">{errors[`room_${roomIndex}`]}</p>
      )}

      <NavigationButtons
        onBack={previousStep}
        onNext={handleNext}
        disableNext={!isFormValid()}
        nextLabel={roomIndex < totalRooms - 1 ? 'Siguiente habitación' : 'Siguiente'}
      />
    </div>
  );
};