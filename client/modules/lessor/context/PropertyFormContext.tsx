'use client';

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import type {
  PropertyFormData,
  RoomData,
  FormState,
  PropertyFormContextType,
  FormErrors
} from '../types/property-form.types';
import { VALIDATION_MESSAGES } from '../utils/constants';
import { validateStep as validateStepUtil } from '../utils/validation';

/**
 * Action types for the reducer
 */
const ACTION_TYPES = {
  UPDATE_FIELD: 'UPDATE_FIELD',
  UPDATE_ROOM: 'UPDATE_ROOM',
  ADD_ROOM: 'ADD_ROOM',
  REMOVE_ROOM: 'REMOVE_ROOM',
  SET_FLOW_TYPE: 'SET_FLOW_TYPE',
  NEXT_STEP: 'NEXT_STEP',
  PREV_STEP: 'PREV_STEP',
  GO_TO_STEP: 'GO_TO_STEP',
  SET_ERRORS: 'SET_ERRORS',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  RESET_FORM: 'RESET_FORM',
  UPDATE_TOTAL_STEPS: 'UPDATE_TOTAL_STEPS',
  SET_CURRENT_ROOM_INDEX: 'SET_CURRENT_ROOM_INDEX',
} as const;

/**
 * Action type definitions
 */
type Action =
  | { type: typeof ACTION_TYPES.UPDATE_FIELD; payload: { field: string; value: any } }
  | { type: typeof ACTION_TYPES.UPDATE_ROOM; payload: { index: number; field: string; value: any } }
  | { type: typeof ACTION_TYPES.ADD_ROOM }
  | { type: typeof ACTION_TYPES.REMOVE_ROOM; payload: number }
  | { type: typeof ACTION_TYPES.SET_FLOW_TYPE; payload: 'single' | 'multiple' }
  | { type: typeof ACTION_TYPES.NEXT_STEP }
  | { type: typeof ACTION_TYPES.PREV_STEP }
  | { type: typeof ACTION_TYPES.GO_TO_STEP; payload: number }
  | { type: typeof ACTION_TYPES.SET_ERRORS; payload: FormErrors }
  | { type: typeof ACTION_TYPES.CLEAR_ERRORS }
  | { type: typeof ACTION_TYPES.RESET_FORM }
  | { type: typeof ACTION_TYPES.UPDATE_TOTAL_STEPS; payload: number }
  | { type: typeof ACTION_TYPES.SET_CURRENT_ROOM_INDEX; payload: number };

/**
 * Creates an empty room data object
 */
const createEmptyRoom = (): RoomData => ({
  id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  price: 0,
  genderPreference: 'mixed',
  bathroomType: 'private',
  isFurnished: false,
  furnitureItems: [],
  notes: '',
});

/**
 * Initial form data state
 */
const initialFormData: PropertyFormData = {
  // Step 1: Property Type
  propertyType: null,

  // Step 2: Rental Type
  rentalType: null,

  // Step 3: Gender Preference
  genderPreference: null,

  // Step 4: Pricing
  monthlyRent: null,
  rooms: [],

  // Step 5: Services
  includedServices: [],

  // Step 6: Common Spaces
  commonSpaces: [],
  otherCommonSpace: undefined,

  // Step 7: Amenities
  amenities: [],

  // Step 7b: Parking
  hasParking: null,
  parkingSpots: undefined,

  // Step 7c: Pet Friendly
  isPetFriendly: null,

  // Step 7d: Security
  hasSecurity: null,

  // Step 8: Furniture
  isFurnished: null,
  furnitureItems: [],

  // Step 9: Bathroom
  bathroomType: null,

  // Step 10: Contract
  contractDuration: null,
  customDurationMonths: undefined,
  requiresGuarantor: undefined,
  requiresAlternativeJustice: undefined,

  // Step 11: Deposit
  depositType: null,
  customDepositAmount: undefined,

  // Step 12: Property Details
  address: '',
  description: '',
  photos: [],

  // Step 13: Contact
  contactName: '',
  contactPhone: '',
  contactEmail: '',
};

/**
 * Initial form state
 */
const initialState: FormState = {
  currentStep: 1,
  formData: initialFormData,
  errors: {},
  flowType: 'single',
  totalSteps: 13, // Default for single flow
  currentRoomIndex: 0,
};

/**
 * Calculates total steps based on flow type and configuration
 */
const calculateTotalSteps = (state: FormState): number => {
  const { flowType, formData } = state;

  if (flowType === 'multiple') {
    const roomCount = formData.rooms?.length || 1;
    return 3 + roomCount + 7; // 3 fixed + rooms + 7 common steps (incluye ContractStep)
  }

  // Flujo single
  let totalSteps = 16; // Base steps (incluyendo PropertyPhotosStep)

  // Si NO incluye servicios, saltar ServicesSelectionStep
  if (formData.includedServices && formData.includedServices.length === 0) {
    totalSteps = 16; // Sin ServicesSelectionStep, con PropertyPhotosStep
  } else {
    totalSteps = 17; // Con ServicesSelectionStep y PropertyPhotosStep
  }

  return totalSteps;
};

/**
 * Reducer function for form state management
 */
const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_FIELD: {
      const { field, value } = action.payload;
      const newState = {
        ...state,
        formData: {
          ...state.formData,
          [field]: value,
        },
      };

      // Check if we need to change flow type based on rental type
      if (field === 'rentalType') {
        if (value === 'room_in_house' || value === 'room_in_apartment') {
          newState.flowType = 'multiple';
          // Initialize with one room if none exist
          if (!newState.formData.rooms || newState.formData.rooms.length === 0) {
            newState.formData.rooms = [createEmptyRoom()];
          }
        } else {
          newState.flowType = 'single';
          // Clear rooms if switching away from multiple
          newState.formData.rooms = [];
        }
        // Recalculate total steps
        newState.totalSteps = calculateTotalSteps(newState);
      }

      // Recalculate total steps if includedServices changes (affects conditional step)
      if (field === 'includedServices') {
        newState.totalSteps = calculateTotalSteps(newState);
      }

      return newState;
    }

    case ACTION_TYPES.UPDATE_ROOM: {
      const { index, field, value } = action.payload;
      const rooms = [...(state.formData.rooms || [])];

      if (rooms[index]) {
        rooms[index] = {
          ...rooms[index],
          [field]: value,
        };
      }

      return {
        ...state,
        formData: {
          ...state.formData,
          rooms,
        },
      };
    }

    case ACTION_TYPES.ADD_ROOM: {
      const rooms = [...(state.formData.rooms || []), createEmptyRoom()];
      const newState = {
        ...state,
        formData: {
          ...state.formData,
          rooms,
        },
      };
      // Recalculate total steps
      newState.totalSteps = calculateTotalSteps(newState);
      return newState;
    }

    case ACTION_TYPES.REMOVE_ROOM: {
      const rooms = [...(state.formData.rooms || [])];
      rooms.splice(action.payload, 1);

      const newState = {
        ...state,
        formData: {
          ...state.formData,
          rooms,
        },
      };
      // Recalculate total steps
      newState.totalSteps = calculateTotalSteps(newState);
      return newState;
    }

    case ACTION_TYPES.SET_FLOW_TYPE: {
      const newState = {
        ...state,
        flowType: action.payload,
      };
      // Recalculate total steps
      newState.totalSteps = calculateTotalSteps(newState);
      return newState;
    }

    case ACTION_TYPES.NEXT_STEP: {
      console.log('[Reducer] NEXT_STEP action received');
      console.log('[Reducer] Current step:', state.currentStep);
      console.log('[Reducer] Total steps:', state.totalSteps);

      const nextStepValue = state.currentStep + 1;
      console.log('[Reducer] Next step will be:', nextStepValue);

      if (nextStepValue > state.totalSteps) {
        console.log('[Reducer] BLOCKED: nextStep > totalSteps');
        return state;
      }

      const newState = {
        ...state,
        currentStep: Math.min(nextStepValue, state.totalSteps),
      };

      console.log('[Reducer] New state currentStep:', newState.currentStep);
      return newState;
    }

    case ACTION_TYPES.PREV_STEP: {
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
        errors: {}, // Clear errors when going back
      };
    }

    case ACTION_TYPES.GO_TO_STEP: {
      return {
        ...state,
        currentStep: Math.max(1, Math.min(action.payload, state.totalSteps)),
      };
    }

    case ACTION_TYPES.SET_ERRORS: {
      return {
        ...state,
        errors: action.payload,
      };
    }

    case ACTION_TYPES.CLEAR_ERRORS: {
      return {
        ...state,
        errors: {},
      };
    }

    case ACTION_TYPES.UPDATE_TOTAL_STEPS: {
      return {
        ...state,
        totalSteps: action.payload,
      };
    }

    case ACTION_TYPES.SET_CURRENT_ROOM_INDEX: {
      return {
        ...state,
        currentRoomIndex: action.payload,
      };
    }

    case ACTION_TYPES.RESET_FORM: {
      return initialState;
    }

    default:
      return state;
  }
};

/**
 * Context for managing property form state
 */
export const PropertyFormContext = createContext<PropertyFormContextType | null>(null);

/**
 * Provider component for property form context
 */
export const PropertyFormProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  /**
   * Update a field in the form data
   */
  const updateFormData = useCallback((data: Partial<PropertyFormData>) => {
    Object.entries(data).forEach(([field, value]) => {
      dispatch({ type: ACTION_TYPES.UPDATE_FIELD, payload: { field, value } });
    });
  }, []);

  /**
   * Update a specific room's data
   */
  const updateRoom = useCallback((index: number, field: string, value: any) => {
    dispatch({ type: ACTION_TYPES.UPDATE_ROOM, payload: { index, field, value } });
  }, []);

  /**
   * Add a new room to the form
   */
  const addRoom = useCallback(() => {
    dispatch({ type: ACTION_TYPES.ADD_ROOM });
  }, []);

  /**
   * Remove a room from the form
   */
  const removeRoom = useCallback((index: number) => {
    dispatch({ type: ACTION_TYPES.REMOVE_ROOM, payload: index });
  }, []);

  /**
   * Set the flow type (single or multiple)
   */
  const setFlowType = useCallback((type: 'single' | 'multiple') => {
    dispatch({ type: ACTION_TYPES.SET_FLOW_TYPE, payload: type });
  }, []);

  /**
   * Validate the current step
   */
  const validateCurrentStep = useCallback((): boolean => {
    console.log('[Context] validateCurrentStep called for step:', state.currentStep);
    console.log('[Context] Flow type:', state.flowType);
    console.log('[Context] Form data includedServices:', state.formData.includedServices);

    const errors = validateStepUtil(state.currentStep, state.formData, state.flowType);
    console.log('[Context] Validation errors:', errors);

    if (Object.keys(errors).length > 0) {
      console.log('[Context] Validation FAILED with errors:', errors);
      dispatch({ type: ACTION_TYPES.SET_ERRORS, payload: errors });
      return false;
    }

    console.log('[Context] Validation PASSED - no errors');
    dispatch({ type: ACTION_TYPES.CLEAR_ERRORS });
    return true;
  }, [state.currentStep, state.formData, state.flowType]);

  /**
   * Move to the next step
   */
  const nextStep = useCallback(() => {
    console.log('[Context] nextStep called');
    console.log('[Context] Current state:', {
      currentStep: state.currentStep,
      totalSteps: state.totalSteps,
      flowType: state.flowType,
      includedServices: state.formData.includedServices
    });

    const isValid = validateCurrentStep();
    console.log('[Context] Validation result:', isValid);
    console.log('[Context] Current errors:', state.errors);

    if (isValid) {
      console.log('[Context] Validation passed, dispatching NEXT_STEP');
      dispatch({ type: ACTION_TYPES.NEXT_STEP });
    } else {
      console.log('[Context] BLOCKED by validation - not advancing');
    }
  }, [validateCurrentStep, state.currentStep, state.totalSteps, state.flowType, state.formData.includedServices, state.errors]);

  /**
   * Move to the previous step
   */
  const previousStep = useCallback(() => {
    dispatch({ type: ACTION_TYPES.PREV_STEP });
  }, []);

  /**
   * Go to a specific step
   */
  const goToStep = useCallback((step: number) => {
    // Validate all steps up to the target step
    let canNavigate = true;
    for (let i = 1; i < step; i++) {
      const errors = validateStepUtil(i, state.formData, state.flowType);
      if (Object.keys(errors).length > 0) {
        canNavigate = false;
        dispatch({ type: ACTION_TYPES.SET_ERRORS, payload: errors });
        break;
      }
    }

    if (canNavigate) {
      dispatch({ type: ACTION_TYPES.GO_TO_STEP, payload: step });
    }
  }, [state.formData, state.flowType]);

  /**
   * Get the current progress percentage
   */
  const getProgress = useCallback((): number => {
    return Math.round((state.currentStep / state.totalSteps) * 100);
  }, [state.currentStep, state.totalSteps]);

  /**
   * Submit the form
   */
  const submitForm = useCallback(async (): Promise<void> => {
    // Validate all steps before submission
    for (let i = 1; i <= state.totalSteps; i++) {
      const errors = validateStepUtil(i, state.formData, state.flowType);
      if (Object.keys(errors).length > 0) {
        dispatch({ type: ACTION_TYPES.SET_ERRORS, payload: errors });
        dispatch({ type: ACTION_TYPES.GO_TO_STEP, payload: i });
        throw new Error('Form validation failed');
      }
    }

    // TODO: Implement API call to submit form data
    console.log('Submitting form:', state.formData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, [state.formData, state.flowType, state.totalSteps]);

  /**
   * Reset the form to initial state
   */
  const resetForm = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET_FORM });
  }, []);

  /**
   * Context value with all state and functions
   */
  const contextValue = useMemo<PropertyFormContextType>(() => ({
    state,
    updateFormData,
    nextStep,
    previousStep,
    goToStep,
    validateCurrentStep,
    submitForm,
    resetForm,
    // Additional functions not in the original interface but needed
    updateRoom,
    addRoom,
    removeRoom,
    setFlowType,
    getProgress,
  }), [
    state,
    updateFormData,
    nextStep,
    previousStep,
    goToStep,
    validateCurrentStep,
    submitForm,
    resetForm,
    updateRoom,
    addRoom,
    removeRoom,
    setFlowType,
    getProgress,
  ]);

  // Save to localStorage on state change (optional)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('propertyFormState', JSON.stringify(state));
    }
  }, [state]);

  // Load from localStorage on mount (optional)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('propertyFormState');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          // You could dispatch an action to restore state here
          // dispatch({ type: ACTION_TYPES.RESTORE_STATE, payload: parsed });
        } catch (error) {
          console.error('Failed to restore form state:', error);
        }
      }
    }
  }, []);

  return (
    <PropertyFormContext.Provider value={contextValue}>
      {children}
    </PropertyFormContext.Provider>
  );
};

/**
 * Hook to access property form context
 */
export const usePropertyFormContext = () => {
  const context = useContext(PropertyFormContext);
  if (!context) {
    throw new Error('usePropertyFormContext must be used within PropertyFormProvider');
  }
  return context;
};