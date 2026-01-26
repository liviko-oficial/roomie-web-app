import { Router } from "express";
import { PetitionController } from "../controllers/petition.controller";
import { authenticateArrendador } from "../../arrendador/middleware/auth.middleware";

/**
 * Routes dedicated to rental application (petition) management.
 * Base path: /api/propiedades/peticiones
 */
const router = Router();

/* ---------------------------------------------------------
   LANDLORD ACTIONS
   --------------------------------------------------------- */

/**
 * PUT /api/propiedades/peticiones/:petitionId/aceptar
 * Final action to formalize a property rental agreement.
 * - Middleware: Verifies the landlord's authentication token.
 * - Controller: Validates property ownership, updates petition status to 'Aceptada', 
 * and links the student (tenant) to the property and landlord records.
 */
router.put(
    "/:petitionId/aceptar",
    authenticateArrendador,
    PetitionController.aceptarSolicitud
);

/**
 * PUT /api/propiedades/peticiones/:petitionId/rechazar
 * Action to deny a specific rental application.
 * - Middleware: Verifies the landlord's authentication token.
 * - Controller: Validates that the requester owns the property and updates 
 * the petition status to 'Rechazada', preventing further processing.
 */
router.put(
    "/:petitionId/rechazar",
    authenticateArrendador,
    PetitionController.rechazarSolicitud
);

router.post(
  "/:petitionId/crearOferta",
  authenticateArrendador,
  PetitionController,crearOferta
);

router.put(
  "/:petitionId/aceptarOferta",
  authenticateArrendador,
  PetitionController,aceptarOferta
);

router.put(
  "/:petitionId/rechazarOferta",
  authenticateArrendador,
  PetitionController, rechazarOferta
);

export default router;
