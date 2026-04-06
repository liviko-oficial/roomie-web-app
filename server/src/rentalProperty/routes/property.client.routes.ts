import { Router } from "express";
import { PropertyClientController } from "../controllers/property.client.controller";
import { require_auth } from "@/user/routes/middleware/login.middleware";

/**
 * Rutas públicas para búsqueda de propiedades (clientes/estudiantes)
 * Base path: /api/propiedades-renta
 *
 * Estas rutas son públicas y no requieren autenticación
 * Algunas tienen comportamiento mejorado si el usuario está autenticado
 */
const router = Router();

/* ----------------------------------------------
   RUTAS PÚBLICAS - Búsqueda de propiedades
------------------------------------------------ */

/**
 * GET /api/propiedades-renta/catalogo
 * Catálogo principal para homepage
 * - No requiere autenticación
 * - Si está autenticado, prioriza propiedades del campus del usuario
 * - Si no, muestra todas ordenadas por popularidad
 *
 * Query params:
 * - page: número de página (default: 1)
 * - limit: resultados por página (default: 20, max: 100)
 */
router.get(
  "/catalogo",
  PropertyClientController.getCatalogo
);

/**
 * GET /api/propiedades-renta/buscar
 * Búsqueda avanzada con múltiples filtros
 * - No requiere autenticación
 *
 * Query params:
 * - campus: "Guadalajara" | "Monterrey" | "Ciudad de México" | "Otro"
 * - tipoPropiedad: "Casa" | "Departamento" | "Cuarto" | etc.
 * - tipoRenta: "Propiedad completa" | "Cuarto privado" | etc.
 * - precioMinimo: número
 * - precioMaximo: número
 * - amueblado: boolean
 * - mascotasPermitidas: boolean
 * - serviciosIncluidos: boolean
 * - numeroBanos: número mínimo
 * - numeroRecamaras: número mínimo
 * - generoPreferido: "Solo hombres" | "Solo mujeres" | "Mixto" | "Sin preferencia"
 * - distanciaMaxima: número (km desde campus)
 * - page: número de página
 * - limit: resultados por página
 * - ordenarPor: "precio_asc" | "precio_desc" | "distancia" | "calificacion" | "fecha_desc"
 */
router.get(
  "/buscar",
  PropertyClientController.searchProperties
);

/**
 * GET /api/propiedades-renta/campus/:campus
 * Filtrar propiedades por campus específico
 * - No requiere autenticación
 * - Caso de uso común: botones de filtro rápido por campus
 *
 * URL params:
 * - campus: "Guadalajara" | "Monterrey" | "Ciudad de México" | "Otro"
 *
 * Query params:
 * - page: número de página (default: 1)
 * - limit: resultados por página (default: 20, max: 100)
 * - ordenarPor: "precio_asc" | "precio_desc" | "distancia" | "calificacion"
 */
router.get(
  "/campus/:campus",
  PropertyClientController.getPropertiesByCampus
);

/**
 * GET /api/propiedades-renta/:propertyId/similares
 * Obtener propiedades similares en el mismo campus
 * - No requiere autenticación
 * - Caso de uso: sugerencias en página de detalle de propiedad
 *
 * URL params:
 * - propertyId: ID de la propiedad de referencia
 *
 * Query params:
 * - limit: número máximo de resultados (default: 6, max: 20)
 *
 * Criterios de similitud:
 * - Mismo campus (obligatorio)
 * - Precio similar (±20%)
 * - Tipo de propiedad similar
 * - Características similares (baños, recámaras)
 */
router.get(
  "/:propertyId/similares",
  PropertyClientController.getSimilarProperties
);

// Crear petición de renta para una propiedad
// TODO: Improve and document
router.post(
  "/:propertyId/solicitar",
  require_auth,
  PropertyClientController.createPeticion
);

export default router;
