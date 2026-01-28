/**
 * Lessor Module Barrel Export
 * Exports all public APIs from the lessor module
 */

// Property Form Components
export * from './components/property-form';

// Context
export { PropertyFormProvider, usePropertyFormContext } from './context/PropertyFormContext';

// Hooks
export { usePropertyForm } from './hooks/usePropertyForm';

// Types
export type {
  PropertyType,
  RentalType,
  GenderPreference,
  BathroomType,
  ContractDuration,
  DepositType,
  RoomData,
  PropertyFormData,
  FormState,
  FormErrors,
  PropertyFormContextType,
  Option,
  StepComponentProps
} from './types/property-form.types';

// Constants
export {
  PROPERTY_TYPES,
  RENTAL_TYPES,
  GENDER_OPTIONS,
  SERVICES_OPTIONS,
  COMMON_SPACES_OPTIONS,
  AMENITIES_OPTIONS,
  FURNITURE_OPTIONS,
  BATHROOM_OPTIONS,
  CONTRACT_DURATIONS,
  DEPOSIT_OPTIONS,
  VALIDATION_MESSAGES,
  FORM_CONFIG,
  STEP_TITLES
} from './utils/constants';

// Validation utilities
export { validateStep, validateForm, validateEmail, validatePhone } from './utils/validation';
