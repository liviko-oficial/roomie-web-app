import { Router } from "express";
import propertyRoutes from "./property.routes";

const router = Router();

/* ----------------------------------------------
   Rutas de propiedades de renta
   - Sistema completo de gestión de propiedades
   - Incluye operaciones CRUD con autenticación
------------------------------------------------ */
router.use("/propiedades-renta", propertyRoutes);

export default router;
