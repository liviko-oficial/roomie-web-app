'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { OptionCard } from './OptionCard';

interface MultiSelectProps {
  /** Array of options to display */
  options: Array<{ value: string; label: string }>;
  /** Array of currently selected values */
  selected: string[];
  /** Callback when selection changes */
  onChange: (selected: string[]) => void;
  /** Number of columns in the grid (responsive) */
  columns?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MultiSelect Component
 * Grid of selectable options with "Select All" functionality
 * Uses OptionCard component for individual items
 */
export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  columns = 3,
  className
}) => {
  // Check if all options are selected
  const allSelected = useMemo(() => {
    return options.length > 0 && options.every(opt => selected.includes(opt.value));
  }, [options, selected]);

  // Check if some but not all options are selected (for indeterminate state)
  const someSelected = useMemo(() => {
    return selected.length > 0 && selected.length < options.length;
  }, [options, selected]);

  // Handle "Todos" option click
  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      onChange([]);
    } else {
      // Select all
      onChange(options.map(opt => opt.value));
    }
  };

  // Handle individual option click
  const handleOptionClick = (value: string) => {
    if (selected.includes(value)) {
      // Remove from selection
      onChange(selected.filter(v => v !== value));
    } else {
      // Add to selection
      onChange([...selected, value]);
    }
  };

  // Generate grid columns class based on columns prop
  const getGridColumns = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'grid gap-3 sm:gap-4',
        getGridColumns()
      )}>
        {/* "Todos" option */}
        <OptionCard
          label="Todos"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {allSelected ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : someSelected ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h8M12 12m-7 0a7 7 0 1114 0 7 7 0 01-14 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
          }
          selected={allSelected}
          onClick={handleSelectAll}
        />

        {/* Individual options */}
        {options.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            selected={selected.includes(option.value)}
            onClick={() => handleOptionClick(option.value)}
          />
        ))}
      </div>

      {/* Selected count indicator */}
      {selected.length > 0 && (
        <div className="mt-4 text-sm text-[#042a5c]">
          <span className="font-medium">{selected.length}</span> de{' '}
          <span className="font-medium">{options.length}</span> opciones seleccionadas
        </div>
      )}
    </div>
  );
};

// Usage Example
/*
import { MultiSelect } from './MultiSelect';

function AmenitiesSelection() {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const amenityOptions = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'parking', label: 'Estacionamiento' },
    { value: 'laundry', label: 'Lavandería' },
    { value: 'kitchen', label: 'Cocina' },
    { value: 'ac', label: 'Aire acondicionado' },
    { value: 'heating', label: 'Calefacción' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-[#042a5c] mb-4">
        Selecciona las amenidades
      </h2>

      <MultiSelect
        options={amenityOptions}
        selected={selectedAmenities}
        onChange={setSelectedAmenities}
        columns={3}
      />

      <div className="mt-6">
        <p className="text-[#042a5c]">
          Amenidades seleccionadas: {selectedAmenities.join(', ') || 'Ninguna'}
        </p>
      </div>
    </div>
  );
}
*/