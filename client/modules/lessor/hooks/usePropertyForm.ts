/**
 * Custom hook for property form management
 * Provides direct access to PropertyFormContext
 */

import { useContext } from 'react';
import { PropertyFormContext } from '../context/PropertyFormContext';
import type { PropertyFormContextType } from '../types/property-form.types';

/**
 * Hook for managing property form state and operations
 * Must be used within PropertyFormProvider
 * @returns Form state and operations from PropertyFormContext
 * @throws Error if used outside of PropertyFormProvider
 */
export const usePropertyForm = (): PropertyFormContextType => {
  const context = useContext(PropertyFormContext);

  if (!context) {
    throw new Error('usePropertyForm must be used within PropertyFormProvider');
  }

  return context;
};