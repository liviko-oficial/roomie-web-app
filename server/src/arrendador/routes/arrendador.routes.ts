import { Router } from "express";
import { ArrendadorController } from "../controllers/arrendadorController";
import { authenticateArrendador, checkOwnership } from "../middleware/auth.middleware";
import { uploadProfilePhoto } from "../middleware/upload.middleware";

const router = Router();

/* ----------------------------------------------
   Rutas públicas (no requieren autenticación)
   - Registro e inicio de sesión de arrendadores
------------------------------------------------ */
// Registro de un nuevo arrendador
router.post("/registro", ArrendadorController.register);

// Inicio de sesión de un arrendador existente
router.post("/login", ArrendadorController.login);

/* ----------------------------------------------
   Middleware de autenticación
   - Todas las rutas definidas a continuación estarán protegidas
------------------------------------------------ */
router.use(authenticateArrendador);

/* ----------------------------------------------
   Rutas generales para arrendadores
   - Acceso permitido únicamente con autenticación
------------------------------------------------ */
// Obtener todos los arrendadores activos
router.get("/", ArrendadorController.getAllArrendadores);

/* ----------------------------------------------
   Rutas específicas de un arrendador
   - Requieren autenticación y verificación de propiedad (ownership)
------------------------------------------------ */
// Obtener perfil de un arrendador por su ID
router.get("/:id", checkOwnership("id"), ArrendadorController.getProfile);

// Actualizar información general de un arrendador
router.put("/:id", checkOwnership("id"), ArrendadorController.updateArrendador);

// Actualizar perfil detallado (foto, datos personales, etc.)
router.put("/:id/perfil", checkOwnership("id"), ArrendadorController.updateProfile);

// Subir foto de perfil (multipart -> Cloudinary -> guarda URL)
router.post("/:id/foto-perfil", checkOwnership("id"), uploadProfilePhoto, ArrendadorController.uploadProfilePhoto);

// Cambiar contraseña del arrendador
router.put("/:id/cambiar-password", checkOwnership("id"), ArrendadorController.changePassword);

// Eliminar o desactivar un arrendador
router.delete("/:id", checkOwnership("id"), ArrendadorController.deleteArrendador);

export default router;
