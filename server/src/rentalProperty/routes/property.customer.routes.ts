import { Router } from "express";
import { PropertyCustomerController } from "../controllers/property.customer.controller";

/**
 * Rutas para búsqueda y gestión de propiedades desde perspectiva del cliente/inquilino
 * Base path: /api/propiedades-renta/cliente
 *
 * ESTADO: Esqueleto - Todos los endpoints devuelven 501 (Not Implemented)
 * REQUIERE: Implementación completa del módulo de clientes y su autenticación
 *
 * Una vez implementada la autenticación de clientes, descomentar el middleware:
 * import { authenticateCliente } from "../../cliente/middleware/auth.middleware";
 */
const router = Router();

/* ----------------------------------------------
   RUTAS DE BÚSQUEDA PERSONALIZADA
   Requieren autenticación de cliente cuando se implemente
------------------------------------------------ */

/**
 * GET /cliente/recomendaciones
 * Obtener propiedades recomendadas basadas en el perfil del cliente
 *
 * Headers requeridos (cuando se implemente):
 * - Authorization: Bearer <token_cliente>
 *
 * Query parameters opcionales:
 * - limit: Número de recomendaciones (default: 10, max: 50)
 * - page: Página de resultados
 *
 * Respuesta esperada:
 * {
 *   "success": true,
 *   "data": {
 *     "recomendaciones": [...propiedades...],
 *     "razonRecomendacion": {
 *       "propiedadId": "razón por la que se recomienda"
 *     },
 *     "scoreCompatibilidad": {
 *       "propiedadId": 0.85  // 0-1 score
 *     }
 *   }
 * }
 */
router.get(
  "/recomendaciones",
  // TODO: Agregar authenticateCliente cuando esté disponible
  PropertyCustomerController.obtenerRecomendaciones
);

/**
 * GET /cliente/busqueda-avanzada
 * Búsqueda avanzada con filtros especiales para clientes
 *
 * Query parameters especiales:
 * - textoLibre: string - Búsqueda en título y descripción
 * - fechaMudanza: date - Fecha deseada de entrada (YYYY-MM-DD)
 * - tiempoMaximoTraslado: number - Minutos máximos al campus
 * - requiereRoommate: boolean - Si busca compartir con roommates
 * - estiloVida: string[] - ["Estudiante", "Trabajador", "Ambos"]
 * - amenidades: string[] - Amenidades específicas requeridas
 * - guardarBusqueda: boolean - Si se debe guardar esta búsqueda
 * - nombreBusqueda: string - Nombre para la búsqueda guardada
 *
 * Además acepta todos los filtros estándar del endpoint público
 */
router.get(
  "/busqueda-avanzada",
  // TODO: Agregar authenticateCliente (opcional para búsqueda, requerido para guardar)
  PropertyCustomerController.busquedaAvanzada
);

/* ----------------------------------------------
   RUTAS DE FAVORITOS
   Requieren autenticación de cliente
------------------------------------------------ */

/**
 * GET /cliente/favoritos
 * Obtener lista de propiedades favoritas del cliente
 */
router.get(
  "/favoritos",
  // TODO: authenticateCliente,
  PropertyCustomerController.obtenerFavoritos
);

/**
 * POST /cliente/favoritos/:propertyId
 * Agregar propiedad a favoritos
 */
router.post(
  "/favoritos/:propertyId",
  // TODO: authenticateCliente,
  PropertyCustomerController.agregarFavorito
);

/**
 * DELETE /cliente/favoritos/:propertyId
 * Eliminar propiedad de favoritos
 */
router.delete(
  "/favoritos/:propertyId",
  // TODO: authenticateCliente,
  PropertyCustomerController.eliminarFavorito
);

/* ----------------------------------------------
   RUTAS DE HISTORIAL Y TRACKING
   Requieren autenticación de cliente
------------------------------------------------ */

/**
 * GET /cliente/vistas-recientes
 * Obtener historial de propiedades vistas recientemente
 *
 * Query parameters:
 * - limit: number (default: 20, max: 50)
 */
router.get(
  "/vistas-recientes",
  // TODO: authenticateCliente,
  PropertyCustomerController.obtenerVistasRecientes
);

/* ----------------------------------------------
   RUTAS DE COMPATIBILIDAD
   Pueden ser públicas o requerir autenticación
------------------------------------------------ */

/**
 * GET /cliente/compatibilidad-roommate
 * Buscar propiedades con roommates compatibles
 *
 * Query parameters:
 * - soloCompatibles: boolean - Solo alta compatibilidad
 * - mostrarScore: boolean - Incluir score numérico
 * - Más todos los filtros estándar
 */
router.get(
  "/compatibilidad-roommate",
  // TODO: authenticateCliente (opcional pero recomendado),
  PropertyCustomerController.buscarPorCompatibilidadRoommate
);

/**
 * GET /cliente/similares/:propertyId
 * Obtener propiedades similares a una específica
 *
 * No requiere autenticación
 *
 * Query parameters:
 * - limit: number (default: 10, max: 20)
 */
router.get(
  "/similares/:propertyId",
  PropertyCustomerController.obtenerPropiedadesSimilares
);

/* ----------------------------------------------
   RUTAS DE BÚSQUEDAS GUARDADAS
   Requieren autenticación de cliente
------------------------------------------------ */

/**
 * GET /cliente/busquedas-guardadas
 * Obtener búsquedas guardadas del cliente
 *
 * Query parameters:
 * - ejecutar: boolean - Si se debe ejecutar cada búsqueda y mostrar resultados nuevos
 */
router.get(
  "/busquedas-guardadas",
  // TODO: authenticateCliente,
  PropertyCustomerController.obtenerBusquedasGuardadas
);

/**
 * POST /cliente/busquedas-guardadas
 * Guardar una nueva búsqueda
 *
 * Body:
 * {
 *   "nombre": "Cuartos cerca del Tec",
 *   "criterios": {...filtros...},
 *   "alertasActivas": true
 * }
 */
router.post(
  "/busquedas-guardadas",
  // TODO: authenticateCliente,
  PropertyCustomerController.guardarBusqueda
);

/* ----------------------------------------------
   RUTAS DE UTILIDADES
   Algunas públicas, otras requieren autenticación
------------------------------------------------ */

/**
 * POST /cliente/comparar
 * Comparar hasta 4 propiedades lado a lado
 *
 * No requiere autenticación
 *
 * Body:
 * {
 *   "propiedadesIds": ["id1", "id2", "id3", "id4"]
 * }
 */
router.post(
  "/comparar",
  PropertyCustomerController.compararPropiedades
);

/**
 * GET /cliente/mapa
 * Obtener propiedades en formato optimizado para mapa
 *
 * Query parameters:
 * - latMin, latMax, lngMin, lngMax: Bounds del mapa
 * - zoom: Nivel de zoom (para clustering)
 * - Más todos los filtros estándar
 */
router.get(
  "/mapa",
  PropertyCustomerController.obtenerPropiedadesMapa
);

export default router;
