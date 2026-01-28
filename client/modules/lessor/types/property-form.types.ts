/**
 * Property Form Type Definitions
 * All type names and values use English for code consistency
 * UI labels (in constants.ts) use Spanish for user-facing content
 */

/**
 * Type of property being rented
 */
export type PropertyType = 'house' | 'apartment' | 'loft';

/**
 * Type of rental arrangement
 */
export type RentalType =
  | 'full_house'
  | 'full_apartment'
  | 'room_in_house'
  | 'room_in_apartment'
  | 'loft';

/**
 * Gender preference for tenants
 */
export type GenderPreference = 'men_only' | 'women_only' | 'mixed';

/**
 * Type of bathroom arrangement
 */
export type BathroomType = 'private' | 'shared' | 'shared_with_2';

/**
 * Contract duration options
 */
export type ContractDuration = 'one_year' | 'six_months' | 'custom';

/**
 * Deposit amount options
 */
export type DepositType = 'one_month' | 'two_months' | 'custom';

/**
 * Individual room data structure for properties with multiple rooms
 */
export interface RoomData {
  /** Unique identifier for the room */
  id: string;
  /** Monthly rent price */
  price: number;
  /** Gender preference for this room */
  genderPreference: GenderPreference;
  /** Type of bathroom arrangement */
  bathroomType: BathroomType;
  /** Whether the room is furnished */
  isFurnished: boolean;
  /** List of furniture items if furnished */
  furnitureItems?: string[];
  /** Room photos */
  photos?: File[];
  /** Services included in room rental */
  includedServices?: string[];
  /** Estimated monthly services cost (when services are NOT included) */
  estimatedServicesCost?: number;
  /** Room-specific amenities or notes */
  notes?: string;
}

/**
 * Complete property form data structure
 * Contains all fields from all steps of the form
 */
export interface PropertyFormData {
  // Step 1: Property Type
  propertyType: PropertyType | null;

  // Step 2: Rental Type
  rentalType: RentalType | null;

  // Step 3: Gender Preference (for single rental or entire property)
  genderPreference: GenderPreference | null;

  // Step 4: Pricing
  /** Monthly rent (for single rentals) or base price */
  monthlyRent: number | null;
  /** Individual room data for multi-room rentals */
  rooms?: RoomData[];

  // Step 5: Services Included
  /** List of included services (water, electricity, internet, etc.) */
  includedServices: string[];
  /** Estimated monthly services cost (when services are NOT included) */
  estimatedServicesCost?: number;

  // Step 6: Common Spaces
  /** List of common spaces available (kitchen, living room, etc.) */
  commonSpaces: string[];
  /** Other common space (custom input) */
  otherCommonSpace?: string;

  // Step 7: Amenities
  /** List of property amenities (pool, gym, parking, etc.) */
  amenities: string[];

  // Step 7b: Parking
  /** Whether property has parking */
  hasParking: boolean | null;
  /** Number of parking spots available */
  parkingSpots?: number;

  // Step 7c: Pet Friendly
  /** Whether the property is pet friendly */
  isPetFriendly: boolean | null;

  // Step 7d: Security
  /** Whether property has private security */
  hasSecurity: boolean | null;

  // Step 8: Furniture (for single rentals)
  /** Whether the property/room is furnished */
  isFurnished: boolean | null;
  /** List of furniture items if furnished */
  furnitureItems?: string[];

  // Step 9: Bathroom (for single rentals)
  /** Type of bathroom arrangement */
  bathroomType: BathroomType | null;

  // Step 10: Contract Details
  /** Contract duration */
  contractDuration: ContractDuration | null;
  /** Custom duration in months if contractDuration is 'custom' */
  customDurationMonths?: number;
  /** Whether guarantor is required (for 1 year contracts) */
  requiresGuarantor?: boolean;
  /** Whether alternative justice is required (for 1 year contracts) */
  requiresAlternativeJustice?: boolean;

  // Step 11: Deposit
  /** Deposit amount type */
  depositType: DepositType | null;
  /** Custom deposit amount if depositType is 'custom' */
  customDepositAmount?: number;

  // Step 12: Property Details
  /** Full address of the property */
  address: string;
  /** Property description */
  description: string;
  /** Property photos */
  photos: File[];

  // Step 13: Contact Information
  /** Lessor's full name */
  contactName: string;
  /** Lessor's phone number */
  contactPhone: string;
  /** Lessor's email */
  contactEmail: string;

  // Additional Fields for New Steps
  /** Walking distance to campus in minutes */
  walkingDistanceMinutes?: number;
  /** Driving distance to campus in minutes */
  drivingDistanceMinutes?: number;
  /** Geographic coordinates for the property */
  coordinates?: { lat: number; lng: number };
}

/**
 * Form state management interface
 */
export interface FormState {
  /** Current step number (1-based) */
  currentStep: number;
  /** Form data */
  formData: PropertyFormData;
  /** Validation errors by field */
  errors: FormErrors;
  /** Flow type: 'single' for single rental, 'multiple' for multi-room */
  flowType: 'single' | 'multiple';
  /** Total number of steps in current flow */
  totalSteps: number;
  /** Current room index being edited (for multi-room flow) */
  currentRoomIndex?: number;
}

/**
 * Validation errors structure
 */
export interface FormErrors {
  [fieldName: string]: string | undefined;
}

/**
 * Context type for PropertyFormContext
 */
export interface PropertyFormContextType {
  /** Current form state */
  state: FormState;
  /** Update form data */
  updateFormData: (data: Partial<PropertyFormData>) => void;
  /** Move to next step */
  nextStep: () => void;
  /** Move to previous step */
  previousStep: () => void;
  /** Go to specific step */
  goToStep: (step: number) => void;
  /** Validate current step */
  validateCurrentStep: () => boolean;
  /** Submit the form */
  submitForm: () => Promise<void>;
  /** Reset form to initial state */
  resetForm: () => void;
  /** Update a specific room's data */
  updateRoom?: (index: number, field: string, value: any) => void;
  /** Add a new room */
  addRoom?: () => void;
  /** Remove a room */
  removeRoom?: (index: number) => void;
  /** Set the flow type */
  setFlowType?: (type: 'single' | 'multiple') => void;
  /** Get the current progress percentage */
  getProgress?: () => number;
}

/**
 * Option type for select dropdowns and radio groups
 */
export interface Option<T = string> {
  value: T;
  label: string;
  description?: string;
}

/**
 * Step component props interface
 */
export interface StepComponentProps {
  /** Callback when step is completed */
  onNext?: () => void;
  /** Callback to go back */
  onBack?: () => void;
}
