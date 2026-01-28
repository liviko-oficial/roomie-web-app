/**
 * Property Form Constants
 * UI labels are in Spanish for user-facing content
 * Values are in English for code consistency
 */

import type { Option } from '../types/property-form.types';

/**
 * Property type options
 */
export const PROPERTY_TYPES: Option[] = [
  { value: 'house', label: 'Casa', description: 'Propiedad independiente' },
  { value: 'apartment', label: 'Departamento', description: 'Unidad en edificio' },
  { value: 'loft', label: 'Loft', description: 'Espacio abierto' }
] as const;

/**
 * Rental type options
 */
export const RENTAL_TYPES: Option[] = [
  { value: 'full_house', label: 'Casa completa', description: 'Toda la casa' },
  { value: 'full_apartment', label: 'Departamento completo', description: 'Todo el departamento' },
  { value: 'room_in_house', label: 'Habitación en casa', description: 'Una habitación en casa compartida' },
  { value: 'room_in_apartment', label: 'Habitación en departamento', description: 'Una habitación en departamento compartido' },
  { value: 'loft', label: 'Loft', description: 'Espacio tipo loft' }
] as const;

/**
 * Gender preference options
 */
export const GENDER_OPTIONS: Option[] = [
  { value: 'men_only', label: 'Solo hombres', description: 'Exclusivamente para hombres' },
  { value: 'women_only', label: 'Solo mujeres', description: 'Exclusivamente para mujeres' },
  { value: 'mixed', label: 'Mixto', description: 'Sin preferencia de género' }
] as const;

/**
 * Services that can be included in rent
 */
export const SERVICES_OPTIONS: Option[] = [
  { value: 'water', label: 'Agua', description: 'Servicio de agua incluido' },
  { value: 'electricity', label: 'Luz', description: 'Servicio eléctrico incluido' },
  { value: 'internet', label: 'Internet', description: 'Conexión a internet incluida' },
  { value: 'gas', label: 'Gas', description: 'Servicio de gas incluido' },
  { value: 'cable', label: 'Cable/TV', description: 'Televisión por cable incluida' },
  { value: 'maintenance', label: 'Mantenimiento', description: 'Mantenimiento del inmueble' },
  { value: 'cleaning', label: 'Limpieza', description: 'Servicio de limpieza incluido' }
] as const;

/**
 * Common spaces available in the property
 */
export const COMMON_SPACES_OPTIONS: Option[] = [
  { value: 'kitchen', label: 'Cocina', description: 'Cocina compartida' },
  { value: 'living_room', label: 'Sala', description: 'Sala de estar' },
  { value: 'dining_room', label: 'Comedor', description: 'Área de comedor' },
  { value: 'laundry', label: 'Lavandería', description: 'Área de lavado' },
  { value: 'patio', label: 'Patio', description: 'Espacio exterior' },
  { value: 'terrace', label: 'Terraza', description: 'Terraza o balcón' },
  { value: 'garden', label: 'Jardín', description: 'Área de jardín' },
  { value: 'study_room', label: 'Sala de estudio', description: 'Espacio para estudiar' }
] as const;

/**
 * Property amenities
 */
export const AMENITIES_OPTIONS: Option[] = [
  { value: 'pool', label: 'Alberca', description: 'Piscina disponible' },
  { value: 'gym', label: 'Gimnasio', description: 'Gimnasio en el edificio' },
  { value: 'parking', label: 'Estacionamiento', description: 'Plaza de estacionamiento' },
  { value: 'security', label: 'Seguridad', description: 'Vigilancia 24/7' },
  { value: 'elevator', label: 'Elevador', description: 'Acceso por elevador' },
  { value: 'air_conditioning', label: 'Aire acondicionado', description: 'AC en la unidad' },
  { value: 'heating', label: 'Calefacción', description: 'Sistema de calefacción' },
  { value: 'pet_friendly', label: 'Acepta mascotas', description: 'Mascotas permitidas' },
  { value: 'near_public_transport', label: 'Cerca de transporte público', description: 'Acceso fácil a transporte' },
  { value: 'near_university', label: 'Cerca de universidad', description: 'Próximo a campus universitario' }
] as const;

/**
 * Furniture items
 */
export const FURNITURE_OPTIONS: Option[] = [
  { value: 'bed', label: 'Cama', description: 'Cama incluida' },
  { value: 'mattress', label: 'Colchón', description: 'Colchón incluido' },
  { value: 'desk', label: 'Escritorio', description: 'Escritorio de trabajo' },
  { value: 'chair', label: 'Silla', description: 'Silla de escritorio' },
  { value: 'closet', label: 'Closet', description: 'Armario o closet' },
  { value: 'nightstand', label: 'Buró', description: 'Mesa de noche' },
  { value: 'dresser', label: 'Cómoda', description: 'Cajonera' },
  { value: 'bookshelf', label: 'Librero', description: 'Estante para libros' },
  { value: 'sofa', label: 'Sofá', description: 'Sofá o sillón' },
  { value: 'dining_table', label: 'Mesa de comedor', description: 'Mesa con sillas' },
  { value: 'tv', label: 'Televisión', description: 'TV incluida' },
  { value: 'refrigerator', label: 'Refrigerador', description: 'Nevera' },
  { value: 'stove', label: 'Estufa', description: 'Estufa u horno' },
  { value: 'microwave', label: 'Microondas', description: 'Horno microondas' },
  { value: 'washing_machine', label: 'Lavadora', description: 'Lavadora disponible' }
] as const;

/**
 * Bathroom type options
 */
export const BATHROOM_OPTIONS: Option[] = [
  { value: 'private', label: 'Baño privado', description: 'Baño exclusivo' },
  { value: 'shared', label: 'Baño compartido', description: 'Compartido con otros inquilinos' },
  { value: 'shared_with_2', label: 'Compartido con 2 personas', description: 'Baño compartido entre 2-3 personas' }
] as const;

/**
 * Contract duration options
 */
export const CONTRACT_DURATIONS: Option[] = [
  { value: 'one_year', label: '1 año', description: '12 meses de contrato' },
  { value: 'six_months', label: '6 meses', description: '6 meses de contrato' },
  { value: 'custom', label: 'Personalizado', description: 'Duración personalizada' }
] as const;

/**
 * Deposit amount options
 */
export const DEPOSIT_OPTIONS: Option[] = [
  { value: 'one_month', label: '1 mes de renta', description: 'Un mes como depósito' },
  { value: 'two_months', label: '2 meses de renta', description: 'Dos meses como depósito' },
  { value: 'custom', label: 'Monto personalizado', description: 'Depósito personalizado' }
] as const;

/**
 * Validation messages in Spanish
 */
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_PRICE: 'El precio debe ser mayor a 0',
  INVALID_EMAIL: 'Correo electrónico inválido',
  INVALID_PHONE: 'Número de teléfono inválido',
  MIN_PHOTOS: 'Debes subir al menos 3 fotos',
  MAX_PHOTOS: 'Máximo 10 fotos permitidas',
  INVALID_ADDRESS: 'La dirección es obligatoria',
  INVALID_DESCRIPTION: 'La descripción debe tener al menos 50 caracteres',
  MIN_ROOMS: 'Debes agregar al menos 1 habitación',
  INVALID_DURATION: 'La duración debe ser entre 1 y 24 meses',
  INVALID_DEPOSIT: 'El depósito debe ser mayor a 0',
  SELECT_AT_LEAST_ONE: 'Selecciona al menos una opción'
} as const;

/**
 * Form configuration
 */
export const FORM_CONFIG = {
  MIN_PRICE: 1000,
  MAX_PRICE: 50000,
  MIN_PHOTOS: 3,
  MAX_PHOTOS: 10,
  MIN_DESCRIPTION_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_DURATION_MONTHS: 1,
  MAX_DURATION_MONTHS: 24,
  MIN_ROOMS: 1,
  MAX_ROOMS: 10
} as const;

/**
 * Step titles for progress indicator
 */
export const STEP_TITLES = {
  PROPERTY_TYPE: 'Tipo de propiedad',
  RENTAL_TYPE: 'Tipo de renta',
  GENDER_PREFERENCE: 'Preferencia de género',
  PRICING: 'Precio',
  SERVICES: 'Servicios incluidos',
  COMMON_SPACES: 'Espacios comunes',
  AMENITIES: 'Amenidades',
  FURNITURE: 'Amueblado',
  BATHROOM: 'Baño',
  CONTRACT: 'Contrato',
  DEPOSIT: 'Depósito',
  PROPERTY_DETAILS: 'Detalles de la propiedad',
  CONTACT: 'Información de contacto'
} as const;
