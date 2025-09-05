import { Router } from "express";
import arrendadorRoutes from "./arrendador.routes";
import propertyRoutes from "./property.routes";

const router = Router();

/* ----------------------------------------------
   Rutas de arrendadores
   - Todas las rutas relacionadas con la gestión de arrendadores
------------------------------------------------ */
router.use("/arrendadores", arrendadorRoutes);

/* ----------------------------------------------
   Rutas de propiedades
   - Todas las rutas relacionadas con la gestión de propiedades
------------------------------------------------ */
router.use("/propiedades", propertyRoutes);

export default router;
