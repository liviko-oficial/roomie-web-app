import { Router } from "express";
import { ArrendadorController } from "../controllers/arrendadorController";
import { authenticateArrendador, checkOwnership } from "../middleware/auth.middleware";

const router = Router();

// Rutas públicas (sin autenticación)
router.post("/registro", ArrendadorController.register);
router.post("/login", ArrendadorController.login);

// Rutas protegidas (requieren autenticación)
router.use(authenticateArrendador);

// Rutas generales de arrendadores
router.get("/", ArrendadorController.getAllArrendadores);

// Rutas específicas de un arrendador (requieren ownership)
router.get("/:id", checkOwnership("id"), ArrendadorController.getProfile);
router.put("/:id", checkOwnership("id"), ArrendadorController.updateArrendador);
router.put("/:id/perfil", checkOwnership("id"), ArrendadorController.updateProfile);
router.put("/:id/cambiar-password", checkOwnership("id"), ArrendadorController.changePassword);
router.delete("/:id", checkOwnership("id"), ArrendadorController.deleteArrendador);

export default router;