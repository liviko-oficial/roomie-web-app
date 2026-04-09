import { Router } from "express";
import propertyRoutes from "./property.routes";
import customerRoutes from "./property.customer.routes";
import clientRoutes from "./property.client.routes";
import peticionRoutes from "./peticion.routes";

const router = Router();

/* ================================================
   ORDEN CRÍTICO: De más específico a menos específico
   ================================================ */

/* Rutas de peticiones (ruta completamente diferente) */
router.use("/peticiones", peticionRoutes);

/* Rutas personalizadas para clientes autenticados
   - Recomendaciones, favoritos, búsquedas guardadas
   - ESTADO: Esqueleto - Pendiente de autenticación de clientes
   - MÁS ESPECÍFICO: /propiedades-renta/cliente */
router.use("/propiedades-renta/cliente", customerRoutes);

/* Rutas públicas de búsqueda para clientes (MONTAR PRIMERO)
   - Catálogo, búsqueda avanzada, filtros por campus
   - No requiere autenticación
   - Solo métodos GET (no conflictua con POST, PUT, DELETE) 
   - IMPORTANTE: Montar ANTES de las rutas generales para evitar conflictos*/
   
router.use("/propiedades-renta", clientRoutes);

/* Rutas de propiedades de renta (CRUD para arrendadores) (MONTAR ÚLTIMO)
   - Sistema completo de gestión de propiedades
   - Incluye operaciones CRUD con autenticación
   - Métodos: POST, PUT, PATCH, DELETE (diferentes a GET) */
router.use("/propiedades-renta", propertyRoutes);

export default router;