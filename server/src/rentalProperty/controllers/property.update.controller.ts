import { Request, Response } from "express";
import { PropiedadRentaDB } from "../models/rentalProperty.schema";
import { PropiedadActualizacionSchema } from "../models/propiedadAuth.schema";
import { MENSAJES_ERROR } from "../lib/constants";

/**
 * Controlador para operaciones de actualización de propiedades
 */
export class PropertyUpdateController {
  /**
   * Actualizar una propiedad completa
   * - Validación con PropiedadActualizacionSchema
   * - Verifica propiedad y ownership (via middleware)
   * - Actualiza campos permitidos
   * - Auto-actualiza fechaActualizacion
   */
  static async updateProperty(req: Request, res: Response) {
    try {
      const { propertyId } = req.params;
      const arrendadorId = req.arrendador?.id;

      if (!arrendadorId) {
        return res.status(401).json({
          success: false,
          message: "Autenticación requerida"
        });
      }

      // Validar datos de entrada
      const validacionResultado = PropiedadActualizacionSchema.safeParse(req.body);

      if (!validacionResultado.success) {
        return res.status(400).json({
          success: false,
          message: MENSAJES_ERROR.DATOS_INVALIDOS,
          errors: validacionResultado.error.errors
        });
      }

      const datosActualizacion = validacionResultado.data;

      // Buscar la propiedad y verificar propiedad
      const propiedad = await PropiedadRentaDB.findById(propertyId);

      if (!propiedad) {
        return res.status(404).json({
          success: false,
          message: MENSAJES_ERROR.PROPIEDAD_NO_ENCONTRADA
        });
      }

      if (propiedad.propietarioId?.toString() !== arrendadorId) {
        return res.status(403).json({
          success: false,
          message: MENSAJES_ERROR.ACCESO_DENEGADO
        });
      }

      // Actualizar campos usando $set para nested objects
      const updateData: any = {
        ...datosActualizacion,
        fechaActualizacion: new Date()
      };

      const propiedadActualizada = await PropiedadRentaDB.findByIdAndUpdate(
        propertyId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('propietarioId', 'email profile.fullName profile.phone');

      return res.status(200).json({
        success: true,
        message: "Propiedad actualizada exitosamente",
        data: propiedadActualizada
      });

    } catch (error: any) {
      console.error("Error al actualizar propiedad:", error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar la propiedad",
        error: error.message
      });
    }
  }

  /**
   * Cambiar estado de propiedad
   * - Permite cambiar entre estados válidos
   * - Valida transiciones según reglas de negocio
   * - Verifica inquilinos activos antes de cambios críticos
   */
  static async cambiarEstadoPropiedad(req: Request, res: Response) {
    try {
      const { propertyId } = req.params;
      const { estado } = req.body;
      const arrendadorId = req.arrendador?.id;

      if (!arrendadorId) {
        return res.status(401).json({
          success: false,
          message: "Autenticación requerida"
        });
      }

      // Validar que el estado sea válido
      const estadosValidos = Object.values(ESTADOS_PROPIEDAD);
      if (!estado || !estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: false,
          message: `Estado inválido. Debe ser uno de: ${estadosValidos.join(", ")}`
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

      if (propiedad.propietarioId?.toString() !== arrendadorId) {
        return res.status(403).json({
          success: false,
          message: MENSAJES_ERROR.ACCESO_DENEGADO
        });
      }

      // Validar transiciones de estado según reglas de negocio
      const estadoActual = propiedad.estado;

      // Si hay inquilinos activos, solo permitir cambiar a "En mantenimiento" o mantener "Rentada"
      if (propiedad.inquilinosActuales && propiedad.inquilinosActuales.length > 0) {
        if (estado !== ESTADOS_PROPIEDAD.RENTADA && estado !== ESTADOS_PROPIEDAD.EN_MANTENIMIENTO) {
          return res.status(400).json({
            success: false,
            message: "No se puede cambiar el estado de una propiedad con inquilinos activos a este estado"
          });
        }
      }

      // Actualizar el estado
      propiedad.estado = estado;
      propiedad.fechaActualizacion = new Date();

      await propiedad.save();

      return res.status(200).json({
        success: true,
        message: `Estado actualizado de "${estadoActual}" a "${estado}"`,
        data: {
          _id: propiedad._id,
          titulo: propiedad.titulo,
          estadoAnterior: estadoActual,
          estadoNuevo: estado,
          fechaActualizacion: propiedad.fechaActualizacion
        }
      });

    } catch (error: any) {
      console.error("Error al cambiar estado de propiedad:", error);
      return res.status(500).json({
        success: false,
        message: "Error al cambiar el estado de la propiedad",
        error: error.message
      });
    }
  }

  /**
   * Actualizar disponibilidad de propiedad
   * - Actualiza fechas y estado de disponibilidad
   * - Valida coherencia de fechas
   * - Verifica inquilinos activos
   */
  static async actualizarDisponibilidad(req: Request, res: Response) {
    try {
      const { propertyId } = req.params;
      const { fechaDisponible, disponible, duracionMinimaContrato, duracionMaximaContrato, renovacionAutomatica } = req.body;
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

      if (propiedad.propietarioId?.toString() !== arrendadorId) {
        return res.status(403).json({
          success: false,
          message: MENSAJES_ERROR.ACCESO_DENEGADO
        });
      }

      // Si se intenta marcar como disponible, verificar que no haya inquilinos activos
      if (disponible === true && propiedad.inquilinosActuales && propiedad.inquilinosActuales.length > 0) {
        return res.status(400).json({
          success: false,
          message: "No se puede marcar como disponible una propiedad con inquilinos activos"
        });
      }

      // Actualizar campos de disponibilidad
      const updateData: any = {};

      if (fechaDisponible !== undefined) {
        const fecha = new Date(fechaDisponible);
        if (isNaN(fecha.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Fecha de disponibilidad inválida"
          });
        }
        updateData["disponibilidad.fechaDisponible"] = fecha;
      }

      if (disponible !== undefined) {
        updateData["disponibilidad.disponible"] = disponible;
      }

      if (duracionMinimaContrato !== undefined) {
        if (duracionMinimaContrato < 1 || duracionMinimaContrato > 24) {
          return res.status(400).json({
            success: false,
            message: "La duración mínima debe estar entre 1 y 24 meses"
          });
        }
        updateData["disponibilidad.duracionMinimaContrato"] = duracionMinimaContrato;
      }

      if (duracionMaximaContrato !== undefined) {
        if (duracionMaximaContrato < 1 || duracionMaximaContrato > 48) {
          return res.status(400).json({
            success: false,
            message: "La duración máxima debe estar entre 1 y 48 meses"
          });
        }
        updateData["disponibilidad.duracionMaximaContrato"] = duracionMaximaContrato;
      }

      if (renovacionAutomatica !== undefined) {
        updateData["disponibilidad.renovacionAutomatica"] = renovacionAutomatica;
      }

      // Validar coherencia de duraciones si ambas están presentes
      const duracionMin = duracionMinimaContrato ?? propiedad.disponibilidad?.duracionMinimaContrato;
      const duracionMax = duracionMaximaContrato ?? propiedad.disponibilidad?.duracionMaximaContrato;

      if (duracionMin && duracionMax && duracionMin > duracionMax) {
        return res.status(400).json({
          success: false,
          message: "La duración mínima no puede ser mayor que la duración máxima"
        });
      }

      updateData.fechaActualizacion = new Date();

      // Actualizar la propiedad
      const propiedadActualizada = await PropiedadRentaDB.findByIdAndUpdate(
        propertyId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Disponibilidad actualizada exitosamente",
        data: {
          _id: propiedadActualizada?._id,
          titulo: propiedadActualizada?.titulo,
          disponibilidad: propiedadActualizada?.disponibilidad,
          fechaActualizacion: propiedadActualizada?.fechaActualizacion
        }
      });

    } catch (error: any) {
      console.error("Error al actualizar disponibilidad:", error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar la disponibilidad",
        error: error.message
      });
    }
  }

  /**
   * Actualizar imágenes de propiedad
   * - Agregar/eliminar imágenes de galería
   * - Cambiar imagen principal
   * - Valida URLs y límites
   */
  static async actualizarImagenes(req: Request, res: Response) {
    try {
      const { propertyId } = req.params;
      const { accion, imagenPrincipal, agregarGaleria, eliminarGaleria, tour360 } = req.body;
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

      if (propiedad.propietarioId?.toString() !== arrendadorId) {
        return res.status(403).json({
          success: false,
          message: MENSAJES_ERROR.ACCESO_DENEGADO
        });
      }

      const updateData: any = {};

      // Validar y actualizar imagen principal
      if (imagenPrincipal) {
        if (!imagenPrincipal.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i)) {
          return res.status(400).json({
            success: false,
            message: "La imagen principal debe ser una URL válida (jpg, jpeg, png, webp)"
          });
        }
        updateData["imagenes.principal"] = imagenPrincipal;
      }

      // Agregar imágenes a galería
      if (agregarGaleria && Array.isArray(agregarGaleria)) {
        // Validar URLs
        for (const url of agregarGaleria) {
          if (!url.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i)) {
            return res.status(400).json({
              success: false,
              message: `URL inválida en galería: ${url}`
            });
          }
        }

        const galeriaActual = propiedad.imagenes?.galeria || [];
        const nuevaGaleria = [...galeriaActual, ...agregarGaleria];

        if (nuevaGaleria.length > 20) {
          return res.status(400).json({
            success: false,
            message: "No se pueden tener más de 20 imágenes en la galería"
          });
        }

        updateData["imagenes.galeria"] = nuevaGaleria;
      }

      // Eliminar imágenes de galería
      if (eliminarGaleria && Array.isArray(eliminarGaleria)) {
        const galeriaActual = propiedad.imagenes?.galeria || [];
        const nuevaGaleria = galeriaActual.filter((img: string) => !eliminarGaleria.includes(img));
        updateData["imagenes.galeria"] = nuevaGaleria;
      }

      // Actualizar tour 360
      if (tour360 !== undefined) {
        if (tour360 && !tour360.match(/^https?:\/\/.+/)) {
          return res.status(400).json({
            success: false,
            message: "El tour 360 debe ser una URL válida"
          });
        }
        updateData["imagenes.tour360"] = tour360;
      }

      updateData.fechaActualizacion = new Date();

      // Actualizar la propiedad
      const propiedadActualizada = await PropiedadRentaDB.findByIdAndUpdate(
        propertyId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Imágenes actualizadas exitosamente",
        data: {
          _id: propiedadActualizada?._id,
          titulo: propiedadActualizada?.titulo,
          imagenes: propiedadActualizada?.imagenes,
          fechaActualizacion: propiedadActualizada?.fechaActualizacion
        }
      });

    } catch (error: any) {
      console.error("Error al actualizar imágenes:", error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar las imágenes",
        error: error.message
      });
    }
  }
}
