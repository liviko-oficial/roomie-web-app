import { Router } from "express";
import { PropertyController } from "../controllers/property.controller";
import { PropertyUpdateController } from "../controllers/property.update.controller";
import { PropertyDeleteController } from "../controllers/property.delete.controller";
import { authenticateArrendador, checkOwnership } from "../../arrendador/middleware/auth.middleware";
import { verificarPropiedadPropiedad } from "../middleware/property.middleware";
import { uploadPropiedadAssets } from "../middleware/upload.middleware";
import { asyncHandler } from "../../lib/asyncHandler";

/**
 * Rutas para gestión de propiedades de renta
 * Base path: /api/propiedades-renta
 */
const router = Router();

/* ----------------------------------------------
   RUTAS PÚBLICAS (sin autenticación)
------------------------------------------------ */

/**
 * GET /api/propiedades-renta
 * Obtener todas las propiedades activas con filtros y paginación
 * - Público: no requiere autenticación
 * - Soporta filtros: tipo, precio, campus, servicios, etc.
 */
router.get(
  "/",
  asyncHandler(PropertyController.getAllProperties)
);

/**
 * GET /api/propiedades-renta/:propertyId
 * Obtener detalles de una propiedad específica
 * - Público: no requiere autenticación
 * - Incrementa contador de vistas
 */
router.get(
  "/:propertyId",
  asyncHandler(PropertyController.getPropertyById)
);

/**
 * GET /api/propiedades-renta/arrendador/:arrendadorId
 * Obtener todas las propiedades de un arrendador específico
 * - Público para propiedades activas
 * - Privado para ver propiedades inactivas (requiere ser el propietario)
 */
router.get(
  "/arrendador/:arrendadorId",
  asyncHandler(PropertyController.getPropertiesByArrendador)
);

/* ----------------------------------------------
   RUTAS PROTEGIDAS (requieren autenticación)
------------------------------------------------ */

/**
 * POST /api/propiedades-renta
 * Crear una nueva propiedad
 * - Requiere: autenticación de arrendador
 * - Validación: PropiedadCreacionSchema
 */
router.post(
  "/",
  authenticateArrendador,
  uploadPropiedadAssets,
  asyncHandler(PropertyController.createProperty)
);

/**
 * PUT /api/propiedades-renta/:propertyId
 * Actualizar una propiedad existente
 * - Requiere: autenticación de arrendador y ser propietario
 */
router.put(
  "/:propertyId",
  authenticateArrendador,
  asyncHandler(PropertyUpdateController.updateProperty)
);

/**
 * PATCH /api/propiedades-renta/:propertyId/estado
 * Cambiar estado de una propiedad (activar/desactivar/pausar)
 * - Requiere: autenticación de arrendador y ser propietario
 */
router.patch(
  "/:propertyId/estado",
  authenticateArrendador,
  asyncHandler(PropertyUpdateController.cambiarEstadoPropiedad)
);

/**
 * PATCH /api/propiedades-renta/:propertyId/disponibilidad
 * Actualizar disponibilidad de una propiedad
 * - Requiere: autenticación de arrendador y ser propietario
 */
router.patch(
  "/:propertyId/disponibilidad",
  authenticateArrendador,
  asyncHandler(PropertyUpdateController.actualizarDisponibilidad)
);

/**
 * PATCH /api/propiedades-renta/:propertyId/imagenes
 * Actualizar imágenes de una propiedad
 * - Requiere: autenticación de arrendador y ser propietario
 */
router.patch(
  "/:propertyId/imagenes",
  authenticateArrendador,
  asyncHandler(PropertyUpdateController.actualizarImagenes)
);

/**
 * DELETE /api/propiedades-renta/:propertyId
 * Eliminar una propiedad (soft delete)
 * - Requiere: autenticación de arrendador y ser propietario
 */
router.delete(
  "/:propertyId",
  authenticateArrendador,
  asyncHandler(PropertyDeleteController.eliminarPropiedad)
);

/**
 * DELETE /api/propiedades-renta/:propertyId/permanente
 * Eliminar permanentemente una propiedad (hard delete)
 * - Requiere: autenticación de arrendador y ser propietario
 * - IRREVERSIBLE
 */
router.delete(
  "/:propertyId/permanente",
  authenticateArrendador,
  asyncHandler(PropertyDeleteController.eliminarPermanentemente)
);

/**
 * PATCH /api/propiedades-renta/:propertyId/restaurar
 * Restaurar una propiedad eliminada lógicamente
 * - Requiere: autenticación de arrendador y ser propietario
 */
router.patch(
  "/:propertyId/restaurar",
  authenticateArrendador,
  asyncHandler(PropertyDeleteController.restaurarPropiedad)
);

export default router;
