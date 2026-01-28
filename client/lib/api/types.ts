/**
 * TypeScript interfaces for API service methods
 */

// ============================================
// Arrendador (Lessor/Landlord) Types
// ============================================

export interface ArrendadorUpdateData {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  fotoPerfil?: string;
  direccion?: string;
}

// ============================================
// User Types
// ============================================

export interface UserUpdateData {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  fotoPerfil?: string;
  campus?: string;
  carrera?: string;
  semestre?: number;
}

// ============================================
// Property Types
// ============================================

export interface PropertyQueryParams {
  campus?: string;
  precioMin?: number;
  precioMax?: number;
  tipo?: 'casa' | 'departamento' | 'cuarto_casa' | 'cuarto_departamento';
  genero?: 'hombres' | 'mujeres' | 'mixto';
  amueblado?: boolean;
  servicios?: string[];
  mascotas?: boolean;
  estacionamiento?: boolean;
  page?: number;
  limit?: number;
}

export interface PropertyCreateData {
  tipoVivienda: 'casa' | 'departamento';
  tipoRenta: 'casa_completa' | 'departamento_completo' | 'cuarto_casa' | 'cuarto_departamento';
  generoPreferencia: 'hombres' | 'mujeres' | 'mixto';
  precioMensual: number;
  serviciosIncluidos?: string[];
  amueblada?: boolean;
  amenidades?: string[];
  estacionamiento?: boolean;
  cantidadEstacionamientos?: number;
  permiteMascotas?: boolean;
  seguridad?: boolean;
  espaciosComunes?: string[];
  otrosEspacios?: string;
  fotos?: string[];
  direccion: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  distanciaCaminando?: number;
  distanciaAuto?: number;
  descripcion?: string;
  cuartos?: RoomData[];
}

export interface RoomData {
  id?: string;
  precio: number;
  generoPreferencia: 'hombres' | 'mujeres' | 'mixto';
  tipoBano: 'privado' | 'compartido';
  amueblado: boolean;
  muebles?: string[];
  notas?: string;
}

export interface PropertyUpdateData extends Partial<PropertyCreateData> {
  activo?: boolean;
  eliminado?: boolean;
}
