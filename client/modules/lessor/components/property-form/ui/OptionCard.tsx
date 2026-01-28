'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  /** Display label for the option */
  label: string;
  /** Optional icon to display above the label */
  icon?: React.ReactNode;
  /** Optional image URL to display instead of icon */
  image?: string;
  /** Whether this option is currently selected */
  selected: boolean;
  /** Click handler for selection */
  onClick: () => void;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * OptionCard Component
 * A selectable card for property form options with icon/image support
 * Follows Happy Roomie's strict three-color palette
 */
export const OptionCard: React.FC<OptionCardProps> = ({
  label,
  icon,
  image,
  selected,
  onClick,
  disabled = false,
  className
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-pressed={selected}
      aria-label={`${label}${selected ? ' (seleccionado)' : ''}`}
      className={cn(
        // Base styles
        'relative flex flex-col items-center justify-center',
        'p-4 sm:p-6 rounded-lg',
        'border-2 transition-all duration-200',
        'min-h-[100px] sm:min-h-[120px] w-full',
        'focus:outline-none focus:ring-2 focus:ring-[#fdd76c] focus:ring-offset-2',

        // Default state
        'bg-white border-[#042a5c]/20',

        // Hover state (only when not disabled)
        !disabled && 'hover:border-[#042a5c]/40',

        // Selected state
        selected && 'border-[#fdd76c] bg-[#fdd76c]/10',

        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed',

        className
      )}
    >
      {/* Image or Icon */}
      {image ? (
        <img
          src={image}
          alt={label}
          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded mb-2"
        />
      ) : icon ? (
        <div className="text-[#042a5c] mb-2 text-2xl sm:text-3xl">
          {icon}
        </div>
      ) : null}

      {/* Label */}
      <span className={cn(
        'text-sm sm:text-base font-medium text-center',
        'text-[#042a5c]'
      )}>
        {label}
      </span>

      {/* Selected indicator (visual feedback) */}
      {selected && (
        <div className="absolute top-2 right-2">
          <svg
            className="w-5 h-5 text-[#fdd76c]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </button>
  );
};

// Usage Example
/*
import { OptionCard } from './OptionCard';

function PropertyTypeSelection() {
  const [selected, setSelected] = useState('casa');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <OptionCard
        label="Casa"
        icon="🏠"
        selected={selected === 'casa'}
        onClick={() => setSelected('casa')}
      />
      <OptionCard
        label="Departamento"
        icon="🏢"
        selected={selected === 'departamento'}
        onClick={() => setSelected('departamento')}
      />
      <OptionCard
        label="Cuarto"
        icon="🚪"
        selected={selected === 'cuarto'}
        onClick={() => setSelected('cuarto')}
        disabled
      />
    </div>
  );
}
*/