import { Router } from "express";
import { PropertyController } from "../controllers/propertyController";
import { authenticateArrendador, checkOwnership } from "../middleware/auth.middleware";

const router = Router();

/* ----------------------------------------------
   Rutas públicas para ver propiedades
   - No requieren autenticación
------------------------------------------------ */
router.get("/", PropertyController.getAllProperties);
router.get("/:propertyId", PropertyController.getProperty);

/* ----------------------------------------------
   Middleware de autenticación
   - Todas las rutas definidas a continuación requieren autenticación de arrendador
------------------------------------------------ */
router.use(authenticateArrendador);

/* ----------------------------------------------
   Rutas para manejo de propiedades por arrendador
   - Requieren autenticación y verificación de propiedad (ownership)
------------------------------------------------ */
// Crear nueva propiedad
router.post("/:arrendadorId", checkOwnership("arrendadorId"), PropertyController.createProperty);

// Obtener propiedades de un arrendador específico
router.get("/:arrendadorId/mis-propiedades", checkOwnership("arrendadorId"), PropertyController.getPropertiesByArrendador);

/* ----------------------------------------------
   Rutas para editar, eliminar o cambiar estado de propiedades
   - Requieren autenticación y verificación de propiedad (ownership)
------------------------------------------------ */
router.put("/:arrendadorId/propiedad/:propertyId", checkOwnership("arrendadorId"), PropertyController.updateProperty);
router.delete("/:arrendadorId/propiedad/:propertyId", checkOwnership("arrendadorId"), PropertyController.deleteProperty);
router.patch("/:arrendadorId/propiedad/:propertyId/estado", checkOwnership("arrendadorId"), PropertyController.togglePropertyStatus);

export default router;
