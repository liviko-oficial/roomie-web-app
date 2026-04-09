import { Request, Response } from "express";
import { Types } from "mongoose";
import { PeticionDB } from "../models/peticion.schema";
import { PropiedadRentaDB } from "../models/rentalProperty.schema";

/**
 * Controlador para gestión de peticiones de renta
 * Estas operaciones están pensadas para el arrendador autenticado
 */
export class PeticionController {
  /**
   * GET /api/peticiones/arrendador
   * Obtiene todas las peticiones asociadas a propiedades del arrendador autenticado
   */
  static async getPeticionesDelArrendador(req: Request, res: Response) {
    try {
      const arrendadorId = req.arrendador?.id;

      // Validar que exista un arrendador autenticado
      if (!arrendadorId) {
        return res.status(401).json({
          success: false,
          message: "Autenticación requerida"
        });
      }

      // Validar formato del id del arrendador
      if (!Types.ObjectId.isValid(arrendadorId)) {
        return res.status(400).json({
          success: false,
          message: "ID de arrendador inválido"
        });
      }

      const arrendadorObjectId = new Types.ObjectId(arrendadorId);

      // Buscar todas las propiedades de ese arrendador
      const propiedades = await PropiedadRentaDB.find({
        propietarioId: arrendadorObjectId
      }).select("_id");

      const propiedadesIds = propiedades.map((propiedad) => propiedad._id);

      // Si no tiene propiedades, devolvemos lista vacía
      if (propiedadesIds.length === 0) {
        return res.status(200).json({
          success: true,
          data: []
        });
      }

      // Buscar todas las peticiones relacionadas con esas propiedades
      const peticiones = await PeticionDB.find({
        propertyId: { $in: propiedadesIds }
      })
        .sort({ createdAt: -1 })
        .populate("propertyId", "titulo estado disponibilidad informacionFinanciera")
        .populate("userId", "email")
        .lean();

      return res.status(200).json({
        success: true,
        data: peticiones
      });
    } catch (error: any) {
      console.error("Error al obtener peticiones del arrendador:", error);

      return res.status(500).json({
        success: false,
        message: "Error al obtener peticiones",
        error: error.message
      });
    }
  }

  /**
   * PATCH /api/peticiones/:peticionId/estado
   * Cambia el estado de una petición a Aceptada o Rechazada
   */
  static async cambiarEstadoPeticion(req: Request, res: Response) {
    try {
      const { peticionId } = req.params;
      const { estatus } = req.body as {
        estatus: "Aceptada" | "Rechazada";
      };

      const arrendadorId = req.arrendador?.id;

      // Validar autenticación
      if (!arrendadorId) {
        return res.status(401).json({
          success: false,
          message: "Autenticación requerida"
        });
      }

      // Validar ids
      if (!Types.ObjectId.isValid(arrendadorId) || !Types.ObjectId.isValid(peticionId)) {
        return res.status(400).json({
          success: false,
          message: "ID inválido"
        });
      }

      // Validar estatus permitido
      if (!estatus || !["Aceptada", "Rechazada"].includes(estatus)) {
        return res.status(400).json({
          success: false,
          message: "Estatus inválido"
        });
      }

      // Buscar la petición
      const peticion = await PeticionDB.findById(peticionId);

      if (!peticion) {
        return res.status(404).json({
          success: false,
          message: "Petición no encontrada"
        });
      }

      // Buscar la propiedad asociada a esa petición
      const propiedad = await PropiedadRentaDB.findById(peticion.propertyId);

      if (!propiedad) {
        return res.status(404).json({
          success: false,
          message: "Propiedad no encontrada"
        });
      }

      // Validar que el arrendador autenticado sea el dueño de la propiedad
      if (String((propiedad as any).propietarioId) !== String(arrendadorId)) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para modificar esta petición"
        });
      }

      // Para el MVP, solo permitimos procesar peticiones que sigan en proceso
      if (peticion.contexto.estatus !== "En proceso") {
        return res.status(400).json({
          success: false,
          message: "La petición ya fue procesada"
        });
      }

      // Actualizar estado de la petición
      peticion.contexto.estatus = estatus;
      peticion.updatedAt = new Date();

      await peticion.save();

      return res.status(200).json({
        success: true,
        message: "Estatus de la petición actualizado",
        data: peticion
      });
    } catch (error: any) {
      console.error("Error al cambiar estado de la petición:", error);

      return res.status(500).json({
        success: false,
        message: "Error al actualizar la petición",
        error: error.message
      });
    }
  }
}