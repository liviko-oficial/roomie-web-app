import { Request, Response } from "express";
import { PropiedadRentaDB } from "../models/rentalProperty.schema";
import { ArrendadorDB } from "../../arrendador/models/arrendador.schema";
import { MENSAJES_ERROR, ESTADOS_PROPIEDAD } from "../lib/constants";

/**
 * Controlador para operaciones de eliminación de propiedades
 */
export class PropertyDeleteController {
  /**
   * Eliminación lógica (soft delete) de propiedad
   * - Cambia estado a "Inactiva"
   * - Marca como no disponible
   * - Verifica inquilinos activos
   * - Mantiene datos históricos
   */
  static async eliminarPropiedad(req: Request, res: Response) {
    try {
      const { propertyId } = req.params;
      const arrendadorId = req.arrendador?.id;

      if (!arrendadorId) {
        return res.status(401).json({
          success: false,
          message: "Autenticación requerida"
        });
      }

      // Buscar la propiedad
      const propiedad = await PropiedadRentaDB.findById(propertyId);

      if (!propiedad) {
        return res.status(404).json({
          success: false,
          message: MENSAJES_ERROR.PROPIEDAD_NO_ENCONTRADA
        });
      }

      const prop: any = propiedad;

      if (prop.propietarioId?.toString() !== arrendadorId) {
        return res.status(403).json({
          success: false,
          message: MENSAJES_ERROR.ACCESO_DENEGADO
        });
      }

      // Verificar si hay inquilinos activos
      if (prop.inquilinosActuales && prop.inquilinosActuales.length > 0) {
        return res.status(400).json({
          success: false,
          message: "No se puede eliminar una propiedad con inquilinos activos. Por favor, finalice los contratos primero."
        });
      }

      // Realizar soft delete: cambiar estado a Inactiva y marcar como no disponible
      prop.estado = ESTADOS_PROPIEDAD.INACTIVA;
      if (prop.disponibilidad) {
        prop.disponibilidad.disponible = false;
      }
      prop.fechaActualizacion = new Date();

      await propiedad.save();

      return res.status(200).json({
        success: true,
        message: "Propiedad eliminada exitosamente (soft delete)",
        data: {
          _id: prop._id,
          titulo: prop.titulo,
          estado: prop.estado,
          disponible: prop.disponibilidad?.disponible,
          mensaje: "La propiedad fue marcada como inactiva. Puede restaurarla en cualquier momento."
        }
      });

    } catch (error: any) {
      console.error("Error al eliminar propiedad:", error);
      return res.status(500).json({
        success: false,
        message: "Error al eliminar la propiedad",
        error: error.message
      });
    }
  }

  /**
   * Eliminación permanente (hard delete) de propiedad
   * - Borra físicamente de la base de datos
   * - Verifica que no hay inquilinos, aplicaciones, o contratos activos
   * - Elimina del array de propiedades del arrendador
   * - IRREVERSIBLE
   */
  static async eliminarPermanentemente(req: Request, res: Response) {
    try {
      const { propertyId } = req.params;
      const arrendadorId = req.arrendador?.id;

      if (!arrendadorId) {
        return res.status(401).json({
          success: false,
          message: "Autenticación requerida"
        });
      }

      // Buscar la propiedad
      const propiedad = await PropiedadRentaDB.findById(propertyId);

      if (!propiedad) {
        return res.status(404).json({
          success: false,
          message: MENSAJES_ERROR.PROPIEDAD_NO_ENCONTRADA
        });
      }

      const prop: any = propiedad;

      if (prop.propietarioId?.toString() !== arrendadorId) {
        return res.status(403).json({
          success: false,
          message: MENSAJES_ERROR.ACCESO_DENEGADO
        });
      }

      // Verificaciones estrictas para eliminación permanente
      if (prop.inquilinosActuales && prop.inquilinosActuales.length > 0) {
        return res.status(400).json({
          success: false,
          message: "No se puede eliminar permanentemente una propiedad con inquilinos activos"
        });
      }

      if (prop.aplicaciones && prop.aplicaciones.length > 0) {
        return res.status(400).json({
          success: false,
          message: "No se puede eliminar permanentemente una propiedad con aplicaciones pendientes"
        });
      }

      // Guardar información antes de eliminar para respuesta
      const tituloPropiedad = prop.titulo;
      const idPropiedad = prop._id;

      // Eliminar la referencia del array de propiedades del arrendador
      await ArrendadorDB.findByIdAndUpdate(arrendadorId, {
        $pull: { properties: propertyId },
        updatedAt: new Date()
      });

      // Eliminar permanentemente de la base de datos
      await PropiedadRentaDB.findByIdAndDelete(propertyId);

      return res.status(200).json({
        success: true,
        message: "Propiedad eliminada permanentemente",
        data: {
          _id: idPropiedad,
          titulo: tituloPropiedad,
          mensaje: "La propiedad ha sido eliminada permanentemente. Esta acción es irreversible."
        }
      });

    } catch (error: any) {
      console.error("Error al eliminar permanentemente propiedad:", error);
      return res.status(500).json({
        success: false,
        message: "Error al eliminar permanentemente la propiedad",
        error: error.message
      });
    }
  }

  /**
   * Restaurar propiedad eliminada lógicamente
   * - Cambia estado de "Inactiva" a "Activa"
   * - Marca como disponible
   * - Solo funciona para soft deletes
   */
  static async restaurarPropiedad(req: Request, res: Response) {
    try {
      const { propertyId } = req.params;
      const arrendadorId = req.arrendador?.id;

      if (!arrendadorId) {
        return res.status(401).json({
          success: false,
          message: "Autenticación requerida"
        });
      }

      // Buscar la propiedad
      const propiedad = await PropiedadRentaDB.findById(propertyId);

      if (!propiedad) {
        return res.status(404).json({
          success: false,
          message: MENSAJES_ERROR.PROPIEDAD_NO_ENCONTRADA
        });
      }

      const prop: any = propiedad;

      if (prop.propietarioId?.toString() !== arrendadorId) {
        return res.status(403).json({
          success: false,
          message: MENSAJES_ERROR.ACCESO_DENEGADO
        });
      }

      // Verificar que la propiedad esté inactiva (soft deleted)
      if (prop.estado !== ESTADOS_PROPIEDAD.INACTIVA) {
        return res.status(400).json({
          success: false,
          message: `No se puede restaurar una propiedad con estado "${prop.estado}". Solo se pueden restaurar propiedades inactivas.`
        });
      }

      // Restaurar la propiedad
      prop.estado = ESTADOS_PROPIEDAD.ACTIVA;
      if (prop.disponibilidad) {
        prop.disponibilidad.disponible = true;
      }
      prop.fechaActualizacion = new Date();

      await propiedad.save();

      return res.status(200).json({
        success: true,
        message: "Propiedad restaurada exitosamente",
        data: {
          _id: prop._id,
          titulo: prop.titulo,
          estado: prop.estado,
          disponible: prop.disponibilidad?.disponible,
          mensaje: "La propiedad ha sido restaurada y está nuevamente activa."
        }
      });

    } catch (error: any) {
      console.error("Error al restaurar propiedad:", error);
      return res.status(500).json({
        success: false,
        message: "Error al restaurar la propiedad",
        error: error.message
      });
    }
  }
}
