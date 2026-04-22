import { Router } from "express";
import { PetitionController } from "../controllers/petition.controller";
import { authenticateArrendador } from "../../arrendador/middleware/auth.middleware";
import { authenticateStudent } from "../../user/middleware/auth.middleware";

const router = Router();

// Student routes (require student auth)
router.get("/usuario/:userId", authenticateStudent, PetitionController.listByStudent);
router.put("/:petitionId/contraoferta", authenticateStudent, PetitionController.contraoferta);

// Landlord routes (require landlord auth)
router.put("/:petitionId/aceptar", authenticateArrendador, PetitionController.aceptarSolicitud);
router.put("/:petitionId/rechazar", authenticateArrendador, PetitionController.rechazarSolicitud);

export default router;