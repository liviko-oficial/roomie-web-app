'use client';

import React, { useState } from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { NavigationButtons } from '../ui';
import type { Option } from '@/modules/lessor/types/property-form.types';

/**
 * Step 13: Room Count Selection
 * Question: "¿Cuántas habitaciones tiene?"
 * Shown only for multi-room rentals (flowType === 'multiple')
 */
export const RoomCountStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep,
    addRoom
  } = usePropertyForm();

  const { formData, errors, flowType } = state;
  const [roomCount, setRoomCount] = useState(formData.rooms?.length || 1);

  // Room count options (1-5)
  const roomCountOptions: Option[] = [
    { value: '1', label: '1 habitación' },
    { value: '2', label: '2 habitaciones' },
    { value: '3', label: '3 habitaciones' },
    { value: '4', label: '4 habitaciones' },
    { value: '5', label: '5 habitaciones' }
  ];

  const handleRoomCountSelect = (count: string) => {
    const numCount = parseInt(count, 10);
    setRoomCount(numCount);
  };

  const handleNext = () => {
    // Initialize rooms array with the selected count
    const currentRoomCount = formData.rooms?.length || 0;
    const targetCount = roomCount;

    if (targetCount > currentRoomCount && addRoom) {
      // Add rooms to reach target count
      for (let i = currentRoomCount; i < targetCount; i++) {
        addRoom();
      }
    } else if (targetCount < currentRoomCount) {
      // Remove excess rooms (keeping only the first N rooms)
      const newRooms = formData.rooms?.slice(0, targetCount) || [];
      updateFormData({ rooms: newRooms });
    }

    // Set current room index to 0 to start with first room
    // Note: This would need to be added to the context if not already there
    nextStep();
  };

  // Only show this step for multi-room flow
  if (flowType !== 'multiple') {
    nextStep();
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        ¿Cuántas habitaciones tiene?
      </h2>

      <p className="text-gray-600">
        Selecciona el número de habitaciones disponibles para rentar en tu propiedad.
      </p>

      <div className="max-w-md">
        <label className="block text-sm font-medium text-[#042a5c] mb-2">
          Número de habitaciones
        </label>
        <select
          value={roomCount.toString()}
          onChange={(e) => handleRoomCountSelect(e.target.value)}
          className="w-full px-4 py-3 border-2 border-[#042a5c]/30 rounded-lg focus:border-[#fdd76c] focus:ring-2 focus:ring-[#fdd76c]/20 outline-none text-[#042a5c] bg-white"
        >
          {roomCountOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {errors.rooms && (
        <p className="text-red-500 text-sm">{errors.rooms}</p>
      )}

      <NavigationButtons
        onBack={previousStep}
        onNext={handleNext}
        disableNext={!roomCount}
      />
    </div>
  );
};