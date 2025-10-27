import { Router } from "express";
import propertyRoutes from "./property.routes";
import customerRoutes from "./property.customer.routes";

const router = Router();

/* ----------------------------------------------
   Rutas de propiedades de renta
   - Sistema completo de gestión de propiedades
   - Incluye operaciones CRUD con autenticación
------------------------------------------------ */
router.use("/propiedades-renta", propertyRoutes);

/* ----------------------------------------------
   Rutas específicas para clientes/inquilinos
   - Búsquedas personalizadas y filtros especiales
   - ESTADO: Esqueleto - Pendiente de autenticación de clientes
------------------------------------------------ */
router.use("/propiedades-renta/cliente", customerRoutes);

export default router;
