/* ----------------------------------------------
    Módulo de Propiedades de Renta - Exportaciones principales
    - Punto de entrada principal para el módulo de propiedades
    - Facilita las importaciones desde otros módulos
------------------------------------------------ */

// Modelos y esquemas
export * from './models';

// Constantes y configuraciones
export * from './lib/constants';

// Re-exportaciones útiles para facilitar el desarrollo
export {
  CAMPUS,
  TIPOS_PROPIEDAD,
  TIPOS_RENTA,
  GENERO_PREFERIDO,
  ESTADOS_PROPIEDAD,
  SERVICIOS_DISPONIBLES,
  MUEBLES_DISPONIBLES,
  TIPOS_MASCOTAS,
  TRANSPORTE,
  LIMITES,
  DEFAULTS,
  MENSAJES_ERROR
} from './lib/constants';

// Tipos principales para uso externo
export type {
  PropiedadRenta,
  PropiedadCreacionType,
  PropiedadActualizacionType,
  PropiedadFiltrosType,
  CampusType,
  TipoPropiedadType,
  TipoRentaType,
  GeneroPreferidoType,
  EstadoPropiedadType
} from './models';

export type { OrdenamientoType } from './lib/constants';