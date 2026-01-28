'use client';

import React, { useState, useEffect } from 'react';
import { usePropertyForm } from '@/modules/lessor';
import { FileUpload, NavigationButtons } from '../ui';

/**
 * Property Photos Step - COMPLETO flow only
 * Allows user to upload photos of the entire property (house/apartment/loft)
 * Minimum 1 photo, maximum 5 photos
 */
export const PropertyPhotosStep: React.FC = () => {
  const {
    state,
    updateFormData,
    nextStep,
    previousStep
  } = usePropertyForm();

  const { formData } = state;

  // Local state for photos to prevent excessive context updates
  const [photos, setPhotos] = useState<File[]>(formData.photos || []);

  // Log when photos change
  useEffect(() => {
    console.log('[PropertyPhotosStep] Photos state updated:', photos.length, photos);
  }, [photos]);

  const handleNext = () => {
    console.log('[PropertyPhotosStep] handleNext called');
    console.log('[PropertyPhotosStep] Photos count:', photos.length);
    console.log('[PropertyPhotosStep] Photos:', photos);

    // Validate locally
    if (photos.length < 1) {
      console.log('[PropertyPhotosStep] Validation FAILED: need at least 1 photo');
      return;
    }

    console.log('[PropertyPhotosStep] Validation PASSED, updating context...');

    // Update context with photos
    updateFormData({
      photos
    });

    // Wait for context to update before advancing
    console.log('[PropertyPhotosStep] Calling nextStep in 50ms...');
    setTimeout(() => {
      console.log('[PropertyPhotosStep] Executing nextStep NOW');
      nextStep();
    }, 50);
  };

  const isFormValid = () => {
    return photos.length >= 1;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#042a5c]">
          Fotos de la propiedad
        </h2>
        <p className="text-gray-600 mt-2">
          Sube fotos de tu propiedad para atraer más inquilinos
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-[#fdd76c]/20 border-2 border-[#fdd76c] rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📸</span>
          <div>
            <p className="font-semibold text-[#042a5c]">
              Recomendaciones para mejores fotos
            </p>
            <ul className="text-sm text-gray-600 mt-1 space-y-1">
              <li>• Usa buena iluminación natural</li>
              <li>• Muestra diferentes ángulos de la propiedad</li>
              <li>• Incluye áreas comunes y espacios importantes</li>
              <li>• Mantén los espacios limpios y ordenados</li>
            </ul>
          </div>
        </div>
      </div>

      {/* File upload component */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-[#042a5c]">
          Sube tus fotos
        </h3>
        <p className="text-sm text-gray-600">
          Mínimo 1 foto, máximo 5 fotos
        </p>
        <FileUpload
          onFilesSelected={setPhotos}
          maxFiles={5}
          accept="image/*"
          multiple
        />
        {photos.length > 0 && (
          <p className="text-sm text-green-600 font-medium">
            ✓ {photos.length} {photos.length === 1 ? 'foto cargada' : 'fotos cargadas'}
          </p>
        )}
      </div>

      <NavigationButtons
        onBack={previousStep}
        onNext={handleNext}
        disableNext={!isFormValid()}
      />
    </div>
  );
};
