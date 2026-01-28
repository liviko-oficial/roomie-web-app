'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FormProgressBarProps {
  /** Current step number (1-based) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FormProgressBar Component
 * Displays current progress in a multi-step form
 * Shows step count and percentage with animated progress bar
 */
export const FormProgressBar: React.FC<FormProgressBarProps> = ({
  currentStep,
  totalSteps,
  className
}) => {
  // Ensure values are valid numbers with fallbacks
  const step = currentStep || 1;
  const total = totalSteps || 1;

  // Calculate progress percentage with NaN protection
  const progressPercentage = Math.round((step / total) * 100) || 0;

  // Ensure currentStep is within valid range
  const safeCurrentStep = Math.max(1, Math.min(step, total));

  return (
    <div className={cn('w-full', className)}>
      {/* Progress text */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[#042a5c]">
          Paso {safeCurrentStep} de {total}
        </span>
        <span className="text-sm font-medium text-[#042a5c]">
          {progressPercentage}%
        </span>
      </div>

      {/* Progress bar container */}
      <div
        className="relative w-full h-2 bg-[#042a5c]/20 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso del formulario: ${progressPercentage}%`}
      >
        {/* Progress bar fill */}
        <div
          className={cn(
            'absolute top-0 left-0 h-full bg-[#fdd76c] rounded-full',
            'transition-all duration-500 ease-out'
          )}
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Shimmer effect for active progress */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Optional step indicators */}
      <div className="flex justify-between mt-4">
        {Array.from({ length: total }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < safeCurrentStep;
          const isCurrent = stepNumber === safeCurrentStep;

          return (
            <div
              key={stepNumber}
              className="flex flex-col items-center flex-1"
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  'text-sm font-semibold transition-all duration-300',
                  isCompleted && 'bg-[#fdd76c] text-[#042a5c]',
                  isCurrent && 'bg-[#fdd76c] text-[#042a5c] ring-2 ring-[#fdd76c] ring-offset-2',
                  !isCompleted && !isCurrent && 'bg-[#042a5c]/20 text-[#042a5c]/50'
                )}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Usage Example
/*
import { FormProgressBar } from './FormProgressBar';

function PropertyForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <FormProgressBar
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="mt-8">
        <button
          onClick={() => setCurrentStep(prev => Math.min(prev + 1, totalSteps))}
          className="bg-[#fdd76c] text-[#042a5c] px-6 py-2 rounded-lg"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
*/