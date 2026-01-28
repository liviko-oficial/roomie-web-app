'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NavigationButtonsProps {
  /** Callback for back button (button hidden if not provided) */
  onBack?: () => void;
  /** Callback for next/submit button */
  onNext: () => void;
  /** Custom label for next button */
  nextLabel?: string;
  /** Disable the next button */
  disableNext?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * NavigationButtons Component
 * Back/Next navigation buttons for multi-step forms
 * Follows Happy Roomie's button styling conventions
 */
export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  nextLabel = 'Siguiente',
  disableNext = false,
  className
}) => {
  return (
    <div
      className={cn(
        'flex items-center',
        onBack ? 'justify-between' : 'justify-end',
        className
      )}
    >
      {/* Back Button - Only shown if onBack is provided */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            'px-6 py-3 rounded-lg font-medium',
            'bg-white border-2 border-[#042a5c] text-[#042a5c]',
            'hover:bg-[#042a5c]/5 active:bg-[#042a5c]/10',
            'focus:outline-none focus:ring-2 focus:ring-[#042a5c] focus:ring-offset-2',
            'transition-all duration-200',
            'flex items-center gap-2'
          )}
          aria-label="Regresar al paso anterior"
        >
          {/* Back Arrow Icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Atrás</span>
        </button>
      )}

      {/* Next/Submit Button */}
      <button
        type="button"
        onClick={onNext}
        disabled={disableNext}
        className={cn(
          'px-6 py-3 rounded-lg font-medium',
          'border-2 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'flex items-center gap-2',

          // Default (enabled) state
          !disableNext && [
            'bg-[#fdd76c] text-[#042a5c] border-[#fdd76c]',
            'hover:bg-[#fdd76c]/90 active:bg-[#fdd76c]/80',
            'focus:ring-[#fdd76c]'
          ],

          // Disabled state
          disableNext && [
            'bg-[#fdd76c]/50 text-[#042a5c]/50 border-[#fdd76c]/50',
            'cursor-not-allowed'
          ]
        )}
        aria-label={nextLabel}
        aria-disabled={disableNext}
      >
        <span>{nextLabel}</span>
        {/* Next Arrow Icon */}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

// Additional variant for final submit button
export const SubmitButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  className?: string;
}> = ({
  onClick,
  disabled = false,
  loading = false,
  label = 'Publicar propiedad',
  className
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'w-full sm:w-auto px-8 py-4 rounded-lg font-semibold text-lg',
        'border-2 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'flex items-center justify-center gap-3',

        // Default (enabled) state
        !disabled && !loading && [
          'bg-[#fdd76c] text-[#042a5c] border-[#fdd76c]',
          'hover:bg-[#fdd76c]/90 active:bg-[#fdd76c]/80',
          'focus:ring-[#fdd76c]',
          'transform hover:scale-[1.02] active:scale-[0.98]'
        ],

        // Disabled or loading state
        (disabled || loading) && [
          'bg-[#fdd76c]/50 text-[#042a5c]/50 border-[#fdd76c]/50',
          'cursor-not-allowed'
        ],

        className
      )}
      aria-label={label}
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <>
          {/* Loading Spinner */}
          <svg
            className="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Publicando...</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          {/* Check Icon */}
          <svg
            className="w-6 h-6"
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
        </>
      )}
    </button>
  );
};

// Usage Example
/*
import { NavigationButtons, SubmitButton } from './NavigationButtons';

function PropertyFormStep() {
  const [currentStep, setCurrentStep] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    console.log('Form submitted!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-[#042a5c] mb-4">
          Paso {currentStep} de {totalSteps}
        </h2>

        <p className="text-[#042a5c]">
          Contenido del formulario aquí...
        </p>
      </div>

      {currentStep < totalSteps ? (
        <NavigationButtons
          onBack={currentStep > 1 ? handleBack : undefined}
          onNext={handleNext}
          nextLabel={currentStep === totalSteps - 1 ? 'Revisar' : 'Siguiente'}
          disableNext={false}
        />
      ) : (
        <div className="flex justify-center">
          <SubmitButton
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={false}
            label="Publicar propiedad"
          />
        </div>
      )}
    </div>
  );
}
*/