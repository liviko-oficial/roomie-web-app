/**
 * Validation utilities for property form
 * All validation functions are pure (no side effects)
 * Error messages are in Spanish for user-facing content
 */

import type {
  PropertyFormData,
  FormErrors,
  PropertyType,
  RentalType,
  GenderPreference,
  BathroomType,
  RoomData
} from '../types/property-form.types';
import { VALIDATION_MESSAGES, FORM_CONFIG } from './constants';

/**
 * Validation result interface
 */
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates property type field
 */
export const validatePropertyType = (value: PropertyType | null): ValidationResult => {
  if (!value) {
    return { isValid: false, error: 'Selecciona el tipo de propiedad' };
  }

  const validTypes: PropertyType[] = ['house', 'apartment', 'loft'];
  if (!validTypes.includes(value)) {
    return { isValid: false, error: 'Tipo de propiedad inválido' };
  }

  return { isValid: true };
};

/**
 * Validates rental type field
 */
export const validateRentalType = (value: RentalType | null): ValidationResult => {
  if (!value) {
    return { isValid: false, error: 'Selecciona el tipo de renta' };
  }

  const validTypes: RentalType[] = [
    'full_house',
    'full_apartment',
    'room_in_house',
    'room_in_apartment',
    'loft'
  ];

  if (!validTypes.includes(value)) {
    return { isValid: false, error: 'Tipo de renta inválido' };
  }

  return { isValid: true };
};

/**
 * Validates price field (monthly rent or room price)
 */
export const validatePrice = (value: number | null): ValidationResult => {
  if (value === null || value === undefined) {
    return { isValid: false, error: 'Ingresa un precio válido' };
  }

  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, error: 'El precio debe ser un número válido' };
  }

  if (value <= 0) {
    return { isValid: false, error: 'El precio debe ser mayor a $0' };
  }

  if (value < FORM_CONFIG.MIN_PRICE) {
    return { isValid: false, error: `El precio mínimo es $${FORM_CONFIG.MIN_PRICE}` };
  }

  if (value > FORM_CONFIG.MAX_PRICE) {
    return { isValid: false, error: `El precio máximo es $${FORM_CONFIG.MAX_PRICE}` };
  }

  return { isValid: true };
};

/**
 * Validates services array
 */
export const validateServices = (services: string[]): ValidationResult => {
  if (!services || services.length === 0) {
    return { isValid: false, error: 'Selecciona al menos un servicio incluido' };
  }

  return { isValid: true };
};

/**
 * Validates room count
 */
export const validateRoomCount = (value: number | null): ValidationResult => {
  if (value === null || value === undefined) {
    return { isValid: false, error: 'Especifica el número de habitaciones' };
  }

  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, error: 'El número de habitaciones debe ser válido' };
  }

  if (value < FORM_CONFIG.MIN_ROOMS) {
    return { isValid: false, error: `Debes agregar al menos ${FORM_CONFIG.MIN_ROOMS} habitación` };
  }

  if (value > FORM_CONFIG.MAX_ROOMS) {
    return { isValid: false, error: `El máximo es ${FORM_CONFIG.MAX_ROOMS} habitaciones` };
  }

  return { isValid: true };
};

/**
 * Validates room photos
 */
export const validateRoomPhotos = (photos: File[] | string[]): ValidationResult => {
  if (!photos || photos.length === 0) {
    return { isValid: false, error: 'Sube al menos 1 foto de la habitación' };
  }

  return { isValid: true };
};

/**
 * Validates property photos
 */
export const validatePropertyPhotos = (photos: File[] | string[]): ValidationResult => {
  if (!photos || photos.length < FORM_CONFIG.MIN_PHOTOS) {
    return { isValid: false, error: `Debes subir al menos ${FORM_CONFIG.MIN_PHOTOS} fotos` };
  }

  if (photos.length > FORM_CONFIG.MAX_PHOTOS) {
    return { isValid: false, error: `Máximo ${FORM_CONFIG.MAX_PHOTOS} fotos permitidas` };
  }

  return { isValid: true };
};

/**
 * Validates address field
 */
export const validateAddress = (value: string | null): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: 'La dirección es obligatoria' };
  }

  if (value.trim().length < 10) {
    return { isValid: false, error: 'Ingresa una dirección válida (mínimo 10 caracteres)' };
  }

  return { isValid: true };
};

/**
 * Validates description field
 */
export const validateDescription = (value: string | null): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: 'La descripción es obligatoria' };
  }

  if (value.trim().length < FORM_CONFIG.MIN_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      error: `La descripción debe tener al menos ${FORM_CONFIG.MIN_DESCRIPTION_LENGTH} caracteres`
    };
  }

  if (value.trim().length > FORM_CONFIG.MAX_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      error: `La descripción no puede superar ${FORM_CONFIG.MAX_DESCRIPTION_LENGTH} caracteres`
    };
  }

  return { isValid: true };
};

/**
 * Validates gender preference field
 */
export const validateGenderPreference = (value: GenderPreference | null): ValidationResult => {
  if (!value) {
    return { isValid: false, error: 'Selecciona la preferencia de género' };
  }

  const validPreferences: GenderPreference[] = ['men_only', 'women_only', 'mixed'];
  if (!validPreferences.includes(value)) {
    return { isValid: false, error: 'Preferencia de género inválida' };
  }

  return { isValid: true };
};

/**
 * Validates bathroom type field
 */
export const validateBathroomType = (value: BathroomType | null): ValidationResult => {
  if (!value) {
    return { isValid: false, error: 'Selecciona el tipo de baño' };
  }

  const validTypes: BathroomType[] = ['private', 'shared', 'shared_with_2'];
  if (!validTypes.includes(value)) {
    return { isValid: false, error: 'Tipo de baño inválido' };
  }

  return { isValid: true };
};

/**
 * Validates furnished status
 */
export const validateFurnished = (value: boolean | null): ValidationResult => {
  if (value === null || value === undefined) {
    return { isValid: false, error: 'Indica si está amueblado' };
  }

  return { isValid: true };
};

/**
 * Validates furniture items (only if furnished)
 */
export const validateFurnitureItems = (isFurnished: boolean | null, items: string[]): ValidationResult => {
  if (isFurnished === true && (!items || items.length === 0)) {
    return { isValid: false, error: 'Selecciona al menos un mueble incluido' };
  }

  return { isValid: true };
};

/**
 * Validates contract duration
 */
export const validateContractDuration = (value: string | null): ValidationResult => {
  if (!value) {
    return { isValid: false, error: 'Selecciona la duración del contrato' };
  }

  const validDurations = ['one_year', 'six_months', 'custom'];
  if (!validDurations.includes(value)) {
    return { isValid: false, error: 'Duración del contrato inválida' };
  }

  return { isValid: true };
};

/**
 * Validates custom contract months
 */
export const validateCustomDuration = (
  contractDuration: string | null,
  customMonths: number | undefined
): ValidationResult => {
  if (contractDuration !== 'custom') {
    return { isValid: true };
  }

  if (!customMonths || customMonths <= 0) {
    return { isValid: false, error: 'Especifica la duración en meses' };
  }

  if (customMonths < FORM_CONFIG.MIN_DURATION_MONTHS) {
    return {
      isValid: false,
      error: `La duración mínima es ${FORM_CONFIG.MIN_DURATION_MONTHS} mes`
    };
  }

  if (customMonths > FORM_CONFIG.MAX_DURATION_MONTHS) {
    return {
      isValid: false,
      error: `La duración máxima es ${FORM_CONFIG.MAX_DURATION_MONTHS} meses`
    };
  }

  return { isValid: true };
};

/**
 * Validates deposit type
 */
export const validateDepositType = (value: string | null): ValidationResult => {
  if (!value) {
    return { isValid: false, error: 'Selecciona el tipo de depósito' };
  }

  const validTypes = ['one_month', 'two_months', 'custom'];
  if (!validTypes.includes(value)) {
    return { isValid: false, error: 'Tipo de depósito inválido' };
  }

  return { isValid: true };
};

/**
 * Validates custom deposit amount
 */
export const validateCustomDeposit = (
  depositType: string | null,
  customAmount: number | undefined
): ValidationResult => {
  if (depositType !== 'custom') {
    return { isValid: true };
  }

  if (!customAmount || customAmount <= 0) {
    return { isValid: false, error: 'El depósito debe ser mayor a $0' };
  }

  return { isValid: true };
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format
 */
export const validatePhone = (phone: string): boolean => {
  // Mexican phone format: 10 digits
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  const cleanPhone = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && cleanPhone.length === 10;
};

/**
 * Validates contact information
 */
export const validateContactInfo = (formData: PropertyFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.contactName || formData.contactName.trim().length < 3) {
    errors.contactName = 'El nombre debe tener al menos 3 caracteres';
  }

  if (!formData.contactPhone) {
    errors.contactPhone = 'El teléfono es obligatorio';
  } else if (!validatePhone(formData.contactPhone)) {
    errors.contactPhone = 'Número de teléfono inválido (10 dígitos)';
  }

  if (!formData.contactEmail) {
    errors.contactEmail = 'El correo electrónico es obligatorio';
  } else if (!validateEmail(formData.contactEmail)) {
    errors.contactEmail = 'Correo electrónico inválido';
  }

  return errors;
};

/**
 * Validates a specific room's data
 */
export const validateRoom = (room: RoomData, index: number): FormErrors => {
  const errors: FormErrors = {};
  const prefix = `room_${index}_`;

  const priceValidation = validatePrice(room.price);
  if (!priceValidation.isValid) {
    errors[`${prefix}price`] = priceValidation.error;
  }

  const genderValidation = validateGenderPreference(room.genderPreference);
  if (!genderValidation.isValid) {
    errors[`${prefix}genderPreference`] = genderValidation.error;
  }

  const bathroomValidation = validateBathroomType(room.bathroomType);
  if (!bathroomValidation.isValid) {
    errors[`${prefix}bathroomType`] = bathroomValidation.error;
  }

  const furnishedValidation = validateFurnished(room.isFurnished);
  if (!furnishedValidation.isValid) {
    errors[`${prefix}isFurnished`] = furnishedValidation.error;
  }

  if (room.isFurnished) {
    const furnitureValidation = validateFurnitureItems(room.isFurnished, room.furnitureItems || []);
    if (!furnitureValidation.isValid) {
      errors[`${prefix}furnitureItems`] = furnitureValidation.error;
    }
  }

  return errors;
};

/**
 * Validates a specific step of the form
 * @param step - Step number to validate (1-based)
 * @param formData - Current form data
 * @param flowType - Current flow type ('single' or 'multiple')
 * @returns Object containing validation errors, if any
 */
export const validateStep = (
  step: number,
  formData: PropertyFormData,
  flowType: 'single' | 'multiple' = 'single'
): FormErrors => {
  const errors: FormErrors = {};

  // Adjust step mapping based on flow type
  if (flowType === 'multiple') {
    return validateMultiRoomStep(step, formData);
  }

  // Single rental flow validation
  // Determine if services step was skipped (when includedServices is empty array)
  const hasServices = formData.includedServices && formData.includedServices.length > 0;
  console.log('[Validation] Step:', step, 'HasServices:', hasServices, 'IncludedServices:', formData.includedServices);

  switch (step) {
    case 1: // Property Type
      const propertyTypeValidation = validatePropertyType(formData.propertyType);
      if (!propertyTypeValidation.isValid) {
        errors.propertyType = propertyTypeValidation.error;
      }
      break;

    case 2: // Rental Type
      const rentalTypeValidation = validateRentalType(formData.rentalType);
      if (!rentalTypeValidation.isValid) {
        errors.rentalType = rentalTypeValidation.error;
      }
      break;

    case 3: // Gender Preference
      const genderValidation = validateGenderPreference(formData.genderPreference);
      if (!genderValidation.isValid) {
        errors.genderPreference = genderValidation.error;
      }
      break;

    case 4: // Pricing
      const priceValidation = validatePrice(formData.monthlyRent);
      if (!priceValidation.isValid) {
        errors.monthlyRent = priceValidation.error;
      }
      break;

    case 5: // Services OR Furnished (depends on flow)
      if (hasServices) {
        // User selected YES for services, validate services selection
        const servicesValidation = validateServices(formData.includedServices);
        if (!servicesValidation.isValid) {
          errors.includedServices = servicesValidation.error;
        }
      } else if (formData.includedServices !== undefined) {
        // User selected NO for services (empty array), validate furnished status
        const furnishedValidation = validateFurnished(formData.isFurnished);
        if (!furnishedValidation.isValid) {
          errors.isFurnished = furnishedValidation.error;
        }
      }
      break;

    case 6: // Furnished OR Common Spaces (depends on flow)
      if (hasServices) {
        // With services, step 6 is Furnished
        const furnishedValidation = validateFurnished(formData.isFurnished);
        if (!furnishedValidation.isValid) {
          errors.isFurnished = furnishedValidation.error;
        }
      }
      // Without services, step 6 is CommonSpaces (optional, no validation)
      break;

    case 7: // Common Spaces OR Parking (depends on flow)
      // Both are optional, no validation required
      break;

    case 8: // Parking OR Pet Friendly (depends on flow)
      // Both have optional validation (hasParking and isPetFriendly can be null initially)
      break;

    case 9: // Pet Friendly OR Amenities (depends on flow)
      // Both have optional validation
      break;

    case 10: // Amenities OR Security (depends on flow)
      // Both are optional
      break;

    case 11: // Security OR Contract (depends on flow)
      if (!hasServices) {
        // Without services, step 11 is Contract
        const contractValidation = validateContractDuration(formData.contractDuration);
        if (!contractValidation.isValid) {
          errors.contractDuration = contractValidation.error;
        }
      }
      // With services, step 11 is Security (optional)
      break;

    case 12: // Contract OR Address (depends on flow)
      if (hasServices) {
        // With services, step 12 is Contract
        const contractValidation = validateContractDuration(formData.contractDuration);
        if (!contractValidation.isValid) {
          errors.contractDuration = contractValidation.error;
        }
      } else {
        // Without services, step 12 is Address
        const addressValidation = validateAddress(formData.address);
        if (!addressValidation.isValid) {
          errors.address = addressValidation.error;
        }
      }
      break;

    case 13: // Address OR LocationMap (depends on flow)
      if (hasServices) {
        // With services, step 13 is Address
        const addressValidation = validateAddress(formData.address);
        if (!addressValidation.isValid) {
          errors.address = addressValidation.error;
        }
      }
      // Without services, step 13 is LocationMap (optional)
      break;

    case 14: // LocationMap OR Distance (depends on flow)
      // Both are optional
      break;

    case 15: // Distance OR PropertyPhotosStep (depends on flow)
      // Distance is optional, PropertyPhotosStep validated below
      if (flowType === 'single') {
        // PropertyPhotosStep when NO services, or DistanceStep when services
        if (formData.includedServices && formData.includedServices.length === 0) {
          // PropertyPhotosStep - require at least 1 photo
          if (!formData.photos || formData.photos.length < 1) {
            errors.photos = 'Debes subir al menos 1 foto de la propiedad';
          }
        }
      }
      break;

    case 16: // PropertyPhotosStep OR Review (depends on flow)
      if (flowType === 'single') {
        // PropertyPhotosStep when services included, or Review when NO services
        if (!formData.includedServices || formData.includedServices.length > 0) {
          // PropertyPhotosStep - require at least 1 photo
          if (!formData.photos || formData.photos.length < 1) {
            errors.photos = 'Debes subir al menos 1 foto de la propiedad';
          }
        }
      }
      break;

    case 17: // Review
      // No validation for review step
      break;

    default:
      break;
  }

  return errors;
};

/**
 * Validates steps for multi-room flow
 */
const validateMultiRoomStep = (step: number, formData: PropertyFormData): FormErrors => {
  const errors: FormErrors = {};
  const rooms = formData.rooms || [];

  console.log('[Validation-MultiRoom] Step:', step, 'Rooms:', rooms.length);

  // Steps 1-3 are fixed
  if (step === 1) {
    const propertyTypeValidation = validatePropertyType(formData.propertyType);
    if (!propertyTypeValidation.isValid) {
      errors.propertyType = propertyTypeValidation.error;
    }
  } else if (step === 2) {
    const rentalTypeValidation = validateRentalType(formData.rentalType);
    if (!rentalTypeValidation.isValid) {
      errors.rentalType = rentalTypeValidation.error;
    }
  } else if (step === 3) {
    // Room count validation
    const roomCountValidation = validateRoomCount(rooms.length);
    if (!roomCountValidation.isValid) {
      errors.roomCount = roomCountValidation.error;
    }
  } else {
    // Steps 4-N are room detail steps
    const roomStepsEnd = 3 + rooms.length;

    if (step > 3 && step <= roomStepsEnd) {
      // This is a RoomDetailStep
      const roomIndex = step - 4;
      console.log('[Validation-MultiRoom] Validating room', roomIndex);

      if (roomIndex < rooms.length) {
        const room = rooms[roomIndex];
        // For now, RoomDetailStep validates all room fields at once
        // In the future, might want to split into sub-steps
        // But for now, no validation as fields are optional during entry
      }
    } else {
      // After room steps, validate remaining common steps based on actual flow
      const remainingStepOffset = step - roomStepsEnd;
      console.log('[Validation-MultiRoom] Remaining step offset:', remainingStepOffset);

      switch (remainingStepOffset) {
        case 1: // AddressStep
          const addressValidation = validateAddress(formData.address);
          if (!addressValidation.isValid) {
            errors.address = addressValidation.error;
          }
          break;

        case 2: // LocationMapStep
          // Optional, no validation
          break;

        case 3: // ParkingStep
          // Optional, no validation (hasParking can be null)
          break;

        case 4: // PetFriendlyStep
          // Optional, no validation (isPetFriendly can be null)
          console.log('[Validation-MultiRoom] PetFriendlyStep - no validation required');
          break;

        case 5: // ContractStep
          const contractDurationValidation = validateContractDuration(formData.contractDuration);
          if (!contractDurationValidation.isValid) {
            errors.contractDuration = contractDurationValidation.error;
          }
          const depositValidation = validateDepositType(formData.depositType);
          if (!depositValidation.isValid) {
            errors.depositType = depositValidation.error;
          }
          break;

        case 6: // DistanceStep
          // Optional, no validation
          break;

        case 7: // ReviewStep
          // No validation for review
          break;
      }
    }
  }

  return errors;
};

/**
 * Validates the entire form before submission
 * @param formData - Complete form data
 * @param flowType - Current flow type
 * @returns Object containing all validation errors, if any
 */
export const validateForm = (
  formData: PropertyFormData,
  flowType: 'single' | 'multiple' = 'single'
): FormErrors => {
  const errors: FormErrors = {};

  // Validate all required fields
  const propertyTypeValidation = validatePropertyType(formData.propertyType);
  if (!propertyTypeValidation.isValid) {
    errors.propertyType = propertyTypeValidation.error;
  }

  const rentalTypeValidation = validateRentalType(formData.rentalType);
  if (!rentalTypeValidation.isValid) {
    errors.rentalType = rentalTypeValidation.error;
  }

  if (flowType === 'single') {
    // Single rental validations
    const genderValidation = validateGenderPreference(formData.genderPreference);
    if (!genderValidation.isValid) {
      errors.genderPreference = genderValidation.error;
    }

    const priceValidation = validatePrice(formData.monthlyRent);
    if (!priceValidation.isValid) {
      errors.monthlyRent = priceValidation.error;
    }

    const bathroomValidation = validateBathroomType(formData.bathroomType);
    if (!bathroomValidation.isValid) {
      errors.bathroomType = bathroomValidation.error;
    }

    const furnishedValidation = validateFurnished(formData.isFurnished);
    if (!furnishedValidation.isValid) {
      errors.isFurnished = furnishedValidation.error;
    }

    if (formData.isFurnished === true) {
      const furnitureValidation = validateFurnitureItems(formData.isFurnished, formData.furnitureItems || []);
      if (!furnitureValidation.isValid) {
        errors.furnitureItems = furnitureValidation.error;
      }
    }
  } else {
    // Multi-room validations
    const rooms = formData.rooms || [];

    const roomCountValidation = validateRoomCount(rooms.length);
    if (!roomCountValidation.isValid) {
      errors.roomCount = roomCountValidation.error;
    }

    rooms.forEach((room, index) => {
      const roomErrors = validateRoom(room, index);
      Object.assign(errors, roomErrors);
    });
  }

  // Common validations
  const servicesValidation = validateServices(formData.includedServices);
  if (!servicesValidation.isValid) {
    errors.includedServices = servicesValidation.error;
  }

  const contractValidation = validateContractDuration(formData.contractDuration);
  if (!contractValidation.isValid) {
    errors.contractDuration = contractValidation.error;
  }

  if (formData.contractDuration === 'custom') {
    const customDurationValidation = validateCustomDuration(
      formData.contractDuration,
      formData.customDurationMonths
    );
    if (!customDurationValidation.isValid) {
      errors.customDurationMonths = customDurationValidation.error;
    }
  }

  const depositValidation = validateDepositType(formData.depositType);
  if (!depositValidation.isValid) {
    errors.depositType = depositValidation.error;
  }

  if (formData.depositType === 'custom') {
    const customDepositValidation = validateCustomDeposit(
      formData.depositType,
      formData.customDepositAmount
    );
    if (!customDepositValidation.isValid) {
      errors.customDepositAmount = customDepositValidation.error;
    }
  }

  // Property details
  const addressValidation = validateAddress(formData.address);
  if (!addressValidation.isValid) {
    errors.address = addressValidation.error;
  }

  const descriptionValidation = validateDescription(formData.description);
  if (!descriptionValidation.isValid) {
    errors.description = descriptionValidation.error;
  }

  const photosValidation = validatePropertyPhotos(formData.photos);
  if (!photosValidation.isValid) {
    errors.photos = photosValidation.error;
  }

  // Contact information
  const contactErrors = validateContactInfo(formData);
  Object.assign(errors, contactErrors);

  return errors;
};