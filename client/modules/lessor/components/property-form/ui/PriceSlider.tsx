'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface PriceSliderProps {
  /** Current value */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step increment */
  step: number;
  /** Label for the input */
  label: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PriceSlider Component
 * Price input with both manual text input and slider control
 * Formats currency as MXN with proper thousand separators
 */
export const PriceSlider: React.FC<PriceSliderProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  label,
  className
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Format number with thousand separators
  const formatPrice = (num: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Parse formatted price to number
  const parsePrice = (str: string): number => {
    // Remove all non-numeric characters except decimal point
    const cleanStr = str.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleanStr) || 0;

    // Ensure value is within bounds and on step
    const bounded = Math.max(min, Math.min(max, parsed));
    return Math.round(bounded / step) * step;
  };

  // Update input value when prop value changes (and not focused)
  useEffect(() => {
    if (!isFocused) {
      setInputValue(formatPrice(value));
    }
  }, [value, isFocused]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle input blur
  const handleInputBlur = () => {
    const parsedValue = parsePrice(inputValue);
    onChange(parsedValue);
    setInputValue(formatPrice(parsedValue));
    setIsFocused(false);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsFocused(true);
    // Show raw number when focused for easier editing
    setInputValue(value.toString());
  };

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    onChange(newValue);
  };

  // Calculate slider position percentage
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      <label className="block text-sm font-medium text-[#042a5c] mb-2">
        {label}
      </label>

      {/* Price Input */}
      <div className="mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          className={cn(
            'w-full px-4 py-2 rounded-lg',
            'text-lg font-semibold text-[#042a5c]',
            'border-2 border-[#042a5c]/30',
            'focus:outline-none focus:ring-2 focus:ring-[#fdd76c] focus:border-[#fdd76c]',
            'transition-all duration-200'
          )}
          aria-label={`${label} input`}
        />
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Custom styled slider track */}
        <div className="relative h-2 bg-[#042a5c]/20 rounded-full">
          {/* Filled track */}
          <div
            className="absolute h-full bg-[#fdd76c] rounded-full transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Native range input (styled to be mostly transparent) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className={cn(
            'absolute inset-0 w-full h-2',
            'appearance-none bg-transparent cursor-pointer',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-5',
            '[&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-[#fdd76c]',
            '[&::-webkit-slider-thumb]:border-2',
            '[&::-webkit-slider-thumb]:border-[#042a5c]',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-all',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-webkit-slider-thumb]:active:scale-95',
            '[&::-moz-range-thumb]:appearance-none',
            '[&::-moz-range-thumb]:w-5',
            '[&::-moz-range-thumb]:h-5',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-[#fdd76c]',
            '[&::-moz-range-thumb]:border-2',
            '[&::-moz-range-thumb]:border-[#042a5c]',
            '[&::-moz-range-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:transition-all',
            '[&::-moz-range-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:active:scale-95',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fdd76c] focus-visible:ring-offset-2'
          )}
          aria-label={`${label} slider`}
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-[#042a5c]/50">
          {formatPrice(min)}
        </span>
        <span className="text-xs text-[#042a5c]/50">
          {formatPrice(max)}
        </span>
      </div>
    </div>
  );
};

// Usage Example
/*
import { PriceSlider } from './PriceSlider';

function RentPriceStep() {
  const [price, setPrice] = useState(5000);

  return (
    <div className="max-w-md mx-auto p-6">
      <PriceSlider
        value={price}
        onChange={setPrice}
        min={1000}
        max={30000}
        step={500}
        label="Precio mensual de renta"
      />

      <p className="mt-4 text-[#042a5c]">
        Precio seleccionado: ${price.toLocaleString('es-MX')} MXN
      </p>
    </div>
  );
}
*/