import { Request, Response, NextFunction } from "express";
import { PropiedadRentaDB, PropiedadRenta } from "../models/rentalProperty.schema";
import { MENSAJES_ERROR } from "../lib/constants";

/**
 * Middleware para verificar que el arrendador autenticado es el propietario de la propiedad
 * - Busca la propiedad en la base de datos
 * - Compara el propietarioId con el ID del arrendador autenticado
 * - Permite continuar solo si coinciden
 */
export const verificarPropiedadPropiedad = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { propertyId } = req.params;
    const arrendadorId = req.arrendador?.id;

    // Verificar que hay un arrendador autenticado
    if (!arrendadorId) {
      return res.status(401).json({
        success: false,
        message: "Autenticación requerida"
      });
    }

    // Buscar la propiedad
    const propiedad = await PropiedadRentaDB.findById(propertyId).lean<PropiedadRenta>();

    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: MENSAJES_ERROR.PROPIEDAD_NO_ENCONTRADA
      });
    }

    // Verificar que el arrendador autenticado es el propietario
    if (propiedad.propietarioId?.toString() !== arrendadorId) {
      return res.status(403).json({
        success: false,
        message: MENSAJES_ERROR.ACCESO_DENEGADO
      });
    }

    // Adjuntar la propiedad al request para uso en el controlador
    (req as any).propiedad = propiedad;

    next();
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error al verificar propiedad",
      error: error.message
    });
  }
};

/**
 * TODO: Implementar middleware de validación de estado de propiedad
 *
 * Funcionalidad a desarrollar:
 * - Verificar que la propiedad está en un estado válido para la operación
 * - Por ejemplo, no permitir actualizar una propiedad "Rentada" en ciertos campos
 * - No permitir eliminar propiedades con inquilinos activos
 */
export const validarEstadoPropiedad = (estadosPermitidos: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implementar validación de estado
    next();
  };
};
