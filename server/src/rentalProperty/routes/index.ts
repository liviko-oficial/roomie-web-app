import { Router } from "express";
import propertyRoutes from "./property.routes";
import customerRoutes from "./property.customer.routes";
import clientRoutes from "./property.client.routes";

const router = Router();

/* ----------------------------------------------
   Rutas públicas de búsqueda para clientes
   - Catálogo, búsqueda avanzada, filtros por campus
   - No requiere autenticación
   - IMPORTANTE: Montar ANTES de las rutas generales para evitar conflictos
------------------------------------------------ */
router.use("/propiedades-renta", clientRoutes);

/* ----------------------------------------------
   Rutas de propiedades de renta (CRUD para arrendadores)
   - Sistema completo de gestión de propiedades
   - Incluye operaciones CRUD con autenticación
------------------------------------------------ */
router.use("/propiedades-renta", propertyRoutes);

/* ----------------------------------------------
   Rutas personalizadas para clientes autenticados
   - Recomendaciones, favoritos, búsquedas guardadas
   - ESTADO: Esqueleto - Pendiente de autenticación de clientes
------------------------------------------------ */
router.use("/propiedades-renta/cliente", customerRoutes);

export default router;
