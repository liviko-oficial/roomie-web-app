import { Router } from "express";
import { PropertyController } from "../controllers/propertyController";
import { authenticateArrendador, checkOwnership } from "../middleware/auth.middleware";

const router = Router();

// Rutas públicas para ver propiedades
router.get("/", PropertyController.getAllProperties);
router.get("/:propertyId", PropertyController.getProperty);

// Rutas protegidas (requieren autenticación de arrendador)
router.use(authenticateArrendador);

// Rutas para manejo de propiedades por arrendador
router.post("/:arrendadorId", checkOwnership("arrendadorId"), PropertyController.createProperty);
router.get("/:arrendadorId/mis-propiedades", checkOwnership("arrendadorId"), PropertyController.getPropertiesByArrendador);

// Rutas para editar/eliminar propiedades específicas
router.put("/:arrendadorId/propiedad/:propertyId", checkOwnership("arrendadorId"), PropertyController.updateProperty);
router.delete("/:arrendadorId/propiedad/:propertyId", checkOwnership("arrendadorId"), PropertyController.deleteProperty);
router.patch("/:arrendadorId/propiedad/:propertyId/estado", checkOwnership("arrendadorId"), PropertyController.togglePropertyStatus);

export default router;