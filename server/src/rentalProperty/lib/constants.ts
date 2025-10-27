/* ----------------------------------------------
    Constantes para el módulo de propiedades de renta
    - Valores predefinidos y configuraciones del sistema
------------------------------------------------ */

// Campus disponibles en el sistema
export const CAMPUS = {
  GUADALAJARA: "Guadalajara",
  MONTERREY: "Monterrey",
  CIUDAD_MEXICO: "Ciudad de México",
  OTRO: "Otro"
} as const;

// Tipos de propiedad permitidos
export const TIPOS_PROPIEDAD = {
  CASA: "Casa",
  DEPARTAMENTO: "Departamento",
  CUARTO: "Cuarto",
  STUDIO: "Studio",
  LOFT: "Loft",
  CASA_HUESPEDES: "Casa de huéspedes"
} as const;

// Tipos de renta disponibles
export const TIPOS_RENTA = {
  PROPIEDAD_COMPLETA: "Propiedad completa",
  CUARTO_PRIVADO: "Cuarto privado",
  CUARTO_COMPARTIDO: "Cuarto compartido",
  CAMA_DORMITORIO: "Cama en dormitorio"
} as const;

// Preferencias de género para inquilinos
export const GENERO_PREFERIDO = {
  SOLO_HOMBRES: "Solo hombres",
  SOLO_MUJERES: "Solo mujeres",
  MIXTO: "Mixto",
  SIN_PREFERENCIA: "Sin preferencia"
} as const;

// Estados posibles de una propiedad
export const ESTADOS_PROPIEDAD = {
  ACTIVA: "Activa",
  INACTIVA: "Inactiva",
  RENTADA: "Rentada",
  EN_MANTENIMIENTO: "En mantenimiento",
  PAUSADA: "Pausada"
} as const;

// Servicios disponibles
export const SERVICIOS_DISPONIBLES = {
  LUZ: "Luz",
  AGUA: "Agua",
  GAS: "Gas",
  INTERNET: "Internet",
  CABLE_TV: "Cable/TV",
  LIMPIEZA: "Limpieza",
  MANTENIMIENTO: "Mantenimiento",
  SEGURIDAD: "Seguridad",
  ESTACIONAMIENTO: "Estacionamiento",
  LAVANDERIA: "Lavandería"
} as const;

// Muebles disponibles
export const MUEBLES_DISPONIBLES = {
  CAMA: "Cama",
  ESCRITORIO: "Escritorio",
  SILLA: "Silla",
  ARMARIO: "Armario",
  REFRIGERADOR: "Refrigerador",
  MICROONDAS: "Microondas",
  LAVADORA: "Lavadora",
  SECADORA: "Secadora",
  TELEVISION: "Televisión",
  SOFA: "Sofa",
  MESA_COMEDOR: "Mesa de comedor",
  ESTUFA: "Estufa",
  AIRE_ACONDICIONADO: "Aire acondicionado"
} as const;

// Tipos de mascotas permitidas
export const TIPOS_MASCOTAS = {
  PERROS: "Perros",
  GATOS: "Gatos",
  AVES: "Aves",
  PECES: "Peces",
  OTROS: "Otros"
} as const;

// Medios de transporte
export const TRANSPORTE = {
  CAMION_URBANO: "Camión urbano",
  METRO: "Metro",
  METROBUS: "Metrobús",
  TAXI: "Taxi",
  UBER_DIDI: "Uber/DiDi",
  BICICLETA: "Bicicleta",
  A_PIE: "A pie"
} as const;

// Tipos de documentos oficiales para verificación
export const TIPOS_DOCUMENTO_OFICIAL = {
  INE: "INE",
  PASSPORT: "passport",
  LICENSE: "license"
} as const;

// Unidades de distancia
export const UNIDADES_DISTANCIA = {
  METROS: "metros",
  KILOMETROS: "kilómetros"
} as const;

// Opciones de ordenamiento para búsquedas
export const ORDENAMIENTO = {
  PRECIO_ASC: "precio_asc",
  PRECIO_DESC: "precio_desc",
  DISTANCIA: "distancia",
  CALIFICACION: "calificacion",
  FECHA_DESC: "fecha_desc"
} as const;

// Límites del sistema
export const LIMITES = {
  // Propiedades
  MAX_CAPACIDAD: 20,
  MIN_CAPACIDAD: 1,
  MAX_EDAD: 50,
  MIN_EDAD: 17,

  // Precios (en pesos mexicanos)
  MAX_PRECIO_MENSUAL: 100000,
  MIN_PRECIO_MENSUAL: 1,
  MAX_DEPOSITO: 200000,
  MAX_COMISION: 50000,
  MAX_INCREMENTO_ANUAL: 50, // porcentaje

  // Características físicas
  MAX_METROS_CUADRADOS: 1000,
  MIN_METROS_CUADRADOS: 1,
  MAX_BANOS: 10,
  MIN_BANOS: 1,
  MAX_RECAMARAS: 20,
  MIN_RECAMARAS: 0,
  MAX_PISO: 50,
  MIN_PISO: 0,

  // Ubicación
  MAX_DISTANCIA_CAMPUS: 100, // kilómetros
  MAX_TIEMPO_TRASLADO: 300, // minutos

  // Contratos
  MAX_DURACION_CONTRATO: 48, // meses
  MIN_DURACION_CONTRATO: 1, // meses

  // Multimedia
  MAX_IMAGENES_GALERIA: 20,

  // Textos
  MIN_TITULO: 10,
  MAX_TITULO: 100,
  MIN_DESCRIPCION: 50,
  MAX_DESCRIPCION: 1000,
  MIN_RESUMEN: 20,
  MAX_RESUMEN: 200,

  // Paginación
  MAX_ITEMS_POR_PAGINA: 100,
  DEFAULT_ITEMS_POR_PAGINA: 10
} as const;

// Mensajes de error comunes
export const MENSAJES_ERROR = {
  PROPIEDAD_NO_ENCONTRADA: "Propiedad no encontrada",
  ACCESO_DENEGADO: "No tienes permisos para acceder a esta propiedad",
  PROPIEDAD_NO_DISPONIBLE: "La propiedad no está disponible",
  DATOS_INVALIDOS: "Los datos proporcionados no son válidos",
  IMAGEN_REQUERIDA: "Se requiere al menos una imagen principal",
  PRECIO_INVALIDO: "El precio debe ser mayor a 0",
  CAPACIDAD_INVALIDA: "La capacidad debe estar entre 1 y 20 personas",
  DISTANCIA_INVALIDA: "La distancia debe ser un valor positivo"
} as const;

// Regex patterns para validación
export const PATRONES = {
  CODIGO_POSTAL_MEXICO: /^\d{5}$/,
  EXTENSION_IMAGEN: /\.(jpg|jpeg|png|webp)$/i,
  CARACTERES_NO_PERMITIDOS_TITULO: /[<>"'&]/
} as const;

// Configuraciones por defecto
export const DEFAULTS = {
  CAMPUS: CAMPUS.GUADALAJARA,
  GENERO_PREFERIDO: GENERO_PREFERIDO.SIN_PREFERENCIA,
  ESTADO_PROPIEDAD: ESTADOS_PROPIEDAD.ACTIVA,
  EDAD_MINIMA: 18,
  EDAD_MAXIMA: 30,
  DURACION_MINIMA_CONTRATO: 6,
  DURACION_MAXIMA_CONTRATO: 12,
  UNIDAD_DISTANCIA: UNIDADES_DISTANCIA.KILOMETROS,
  PAIS: "México",
  CALIFICACION_INICIAL: 0,
  REVIEWS_INICIAL: 0,
  VISTAS_INICIAL: 0,
  FAVORITOS_INICIAL: 0
} as const;

// Tipos derivados para TypeScript
export type CampusType = typeof CAMPUS[keyof typeof CAMPUS];
export type TipoPropiedadType = typeof TIPOS_PROPIEDAD[keyof typeof TIPOS_PROPIEDAD];
export type TipoRentaType = typeof TIPOS_RENTA[keyof typeof TIPOS_RENTA];
export type GeneroPreferidoType = typeof GENERO_PREFERIDO[keyof typeof GENERO_PREFERIDO];
export type EstadoPropiedadType = typeof ESTADOS_PROPIEDAD[keyof typeof ESTADOS_PROPIEDAD];
export type ServicioType = typeof SERVICIOS_DISPONIBLES[keyof typeof SERVICIOS_DISPONIBLES];
export type MuebleType = typeof MUEBLES_DISPONIBLES[keyof typeof MUEBLES_DISPONIBLES];
export type TipoMascotaType = typeof TIPOS_MASCOTAS[keyof typeof TIPOS_MASCOTAS];
export type TransporteType = typeof TRANSPORTE[keyof typeof TRANSPORTE];
export type OrdenamientoType = typeof ORDENAMIENTO[keyof typeof ORDENAMIENTO];