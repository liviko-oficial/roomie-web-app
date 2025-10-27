import { Router } from "express";
import { PropertyController } from "../controllers/property.controller";
import { authenticateArrendador, checkOwnership } from "../../arrendador/middleware/auth.middleware";

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
  PropertyController.getAllProperties
);

/**
 * GET /api/propiedades-renta/:propertyId
 * Obtener detalles de una propiedad específica
 * - Público: no requiere autenticación
 * - Incrementa contador de vistas
 */
router.get(
  "/:propertyId",
  PropertyController.getPropertyById
);

/**
 * GET /api/propiedades-renta/arrendador/:arrendadorId
 * Obtener todas las propiedades de un arrendador específico
 * - Público para propiedades activas
 * - Privado para ver propiedades inactivas (requiere ser el propietario)
 */
router.get(
  "/arrendador/:arrendadorId",
  PropertyController.getPropertiesByArrendador
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
  PropertyController.createProperty
);

/**
 * PUT /api/propiedades-renta/:propertyId
 * Actualizar una propiedad existente
 * - Requiere: autenticación de arrendador y ser propietario
 * - TODO: Implementar en property.update.controller.ts
 */
router.put(
  "/:propertyId",
  authenticateArrendador,
  // TODO: agregar middleware de verificación de propiedad
  (req, res) => {
    res.status(501).json({
      success: false,
      message: "Funcionalidad de actualización en desarrollo"
    });
  }
);

/**
 * PATCH /api/propiedades-renta/:propertyId/estado
 * Cambiar estado de una propiedad (activar/desactivar/pausar)
 * - Requiere: autenticación de arrendador y ser propietario
 * - TODO: Implementar en property.update.controller.ts
 */
router.patch(
  "/:propertyId/estado",
  authenticateArrendador,
  // TODO: agregar middleware de verificación de propiedad
  (req, res) => {
    res.status(501).json({
      success: false,
      message: "Funcionalidad de cambio de estado en desarrollo"
    });
  }
);

/**
 * DELETE /api/propiedades-renta/:propertyId
 * Eliminar una propiedad (soft delete)
 * - Requiere: autenticación de arrendador y ser propietario
 * - TODO: Implementar en property.delete.controller.ts
 */
router.delete(
  "/:propertyId",
  authenticateArrendador,
  // TODO: agregar middleware de verificación de propiedad
  (req, res) => {
    res.status(501).json({
      success: false,
      message: "Funcionalidad de eliminación en desarrollo"
    });
  }
);

export default router;
