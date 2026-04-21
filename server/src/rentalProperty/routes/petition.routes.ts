import { Router } from "express";
import { PetitionController } from "../controllers/petition.controller";
import { authenticateArrendador } from "../../arrendador/middleware/auth.middleware";

const router = Router();

// Student: list my petitions (populated with property + landlord data)
router.get("/usuario/:userId", PetitionController.listByStudent);

// Student: send counter-offer
router.put("/:petitionId/contraoferta", PetitionController.contraoferta);

// Landlord: accept petition
router.put("/:petitionId/aceptar", authenticateArrendador, PetitionController.aceptarSolicitud);

// Landlord: reject petition
router.put("/:petitionId/rechazar", authenticateArrendador, PetitionController.rechazarSolicitud);

export default router;