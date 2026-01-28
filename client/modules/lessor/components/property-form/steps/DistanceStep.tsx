'use client';

import React, { useState } from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { NavigationButtons } from '../ui';

/**
 * Custom slider component for time/distance input
 */
const TimeSlider: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}> = ({ label, value, onChange, min = 1, max = 180, step = 1 }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #fdd76c 0%, #fdd76c ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            className="w-20 px-3 py-2 border-2 border-[#042a5c]/30 rounded-lg text-center focus:border-[#fdd76c] outline-none"
          />
          <span className="text-sm text-gray-600">min</span>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min} min</span>
        <span>{Math.floor(max / 2)} min</span>
        <span>{max} min</span>
      </div>
    </div>
  );
};

/**
 * Step 17: Distance to Campus
 * Question: "¿Cuánto tiempo se hace al campus?"
 */
export const DistanceStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData } = state;
  const [walkingMinutes, setWalkingMinutes] = useState(
    formData.walkingDistanceMinutes || 15
  );
  const [drivingMinutes, setDrivingMinutes] = useState(
    formData.drivingDistanceMinutes || 10
  );

  const handleNext = () => {
    // Save distance data
    updateFormData({
      walkingDistanceMinutes: walkingMinutes,
      drivingDistanceMinutes: drivingMinutes
    });
    nextStep();
  };

  // Helper function to format time display
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const hourText = `${hours} hora${hours !== 1 ? 's' : ''}`;
    const minText = mins > 0 ? ` ${mins} minuto${mins !== 1 ? 's' : ''}` : '';
    return hourText + minText;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-[#042a5c]">
        ¿Cuánto tiempo se hace al campus?
      </h2>

      <p className="text-gray-600">
        Indica el tiempo aproximado de traslado desde tu propiedad hasta el campus universitario más cercano.
        Esta información es muy importante para los estudiantes.
      </p>

      {/* Walking time */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#fdd76c]/20 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#042a5c]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-[#042a5c]">Caminando</h3>
            <p className="text-sm text-gray-600">
              Tiempo estimado: {formatTime(walkingMinutes)}
            </p>
          </div>
        </div>
        <TimeSlider
          label="Tiempo caminando"
          value={walkingMinutes}
          onChange={setWalkingMinutes}
          min={1}
          max={180}
          step={1}
        />
      </div>

      {/* Driving time */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#fdd76c]/20 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#042a5c]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-[#042a5c]">En carro</h3>
            <p className="text-sm text-gray-600">
              Tiempo estimado: {formatTime(drivingMinutes)}
            </p>
          </div>
        </div>
        <TimeSlider
          label="Tiempo en carro"
          value={drivingMinutes}
          onChange={setDrivingMinutes}
          min={1}
          max={120}
          step={1}
        />
      </div>

      {/* Additional transportation info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm">
            <p className="text-blue-800 font-medium mb-1">
              Consejo
            </p>
            <p className="text-blue-700">
              Proporciona tiempos realistas. Los estudiantes valoran mucho la cercanía
              al campus y la precisión en esta información les ayuda a tomar mejores decisiones.
            </p>
          </div>
        </div>
      </div>

      <NavigationButtons
        onBack={previousStep}
        onNext={handleNext}
      />
    </div>
  );
};