import { Router } from "express";
import { authenticateArrendador } from "../../arrendador/middleware/auth.middleware";
import { PeticionController } from "../controllers/peticion.controller";

const router = Router();

/**
 * Todas las rutas de peticiones requieren autenticación de arrendador
 */
router.use(authenticateArrendador);

/**
 * GET /api/peticiones/arrendador
 * Ver todas las peticiones de las propiedades del arrendador autenticado
 */
router.get(
  "/arrendador",
  PeticionController.getPeticionesDelArrendador
);

/**
 * PATCH /api/peticiones/:peticionId/estado
 * Cambiar el estado de una petición
 *
 * Body esperado:
 * {
 *   "estatus": "Aceptada"
 * }
 */
router.patch(
  "/:peticionId/estado",
  PeticionController.cambiarEstadoPeticion
);

export default router;