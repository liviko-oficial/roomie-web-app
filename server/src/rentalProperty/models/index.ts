/* ----------------------------------------------
    Exportaciones principales del módulo de propiedades de renta
    - Facilita las importaciones en otros módulos
------------------------------------------------ */

// Esquemas y tipos principales
export {
  PropiedadRentaSchema,
  DireccionSchema,
  CaracteristicasSchema,
  ServiciosSchema,
  PoliticasSchema,
  UbicacionSchema,
  InformacionFinancieraSchema,
  DisponibilidadSchema,
  PropiedadRentaDB
} from './rentalProperty.schema';

// Tipos de TypeScript
export type {
  PropiedadRenta,
  Direccion,
  Caracteristicas,
  Servicios,
  Politicas,
  Ubicacion,
  InformacionFinanciera,
  Disponibilidad
} from './rentalProperty.schema';

// Esquemas de validación para operaciones
export {
  PropiedadCreacionSchema,
  PropiedadActualizacionSchema,
  PropiedadFiltrosSchema
} from './propiedadAuth.schema';

// Tipos de validación
export type {
  PropiedadCreacionSchema as PropiedadCreacionType,
  PropiedadActualizacionSchema as PropiedadActualizacionType,
  PropiedadFiltrosSchema as PropiedadFiltrosType
} from './propiedadAuth.schema';