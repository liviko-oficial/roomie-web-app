import { Request, Response } from "express";
import { PropertyDB, ArrendadorDB } from "../models/arrendador.schema";
import {
  CreatePropertySchema,
  UpdatePropertySchema
} from "../validation/arrendador.validation";
import { PeticionDB } from "@/rentalProperty";
import { PropiedadRentaDB } from "@/rentalProperty/models/rentalProperty.schema";

export class PropertyController {
  /**
   * Crear una nueva propiedad
   * - Válida los datos de entrada
   * - Verifica que el arrendador existe
   * - Crea la propiedad en la base de datos
   * - Agrega la propiedad al array de propiedades del arrendador
   */
  static async createProperty(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.arrendadorId;
      const validatedData = CreatePropertySchema.parse(req.body);

      // Verificar que el arrendador existe
      const arrendador = await ArrendadorDB.findById(arrendadorId);
      if (!arrendador) {
        return res.status(404).json({
          success: false,
          message: "Arrendador no encontrado"
        });
      }

      // Crear y guardar propiedad
      const property = new PropertyDB(validatedData);
      await property.save();

      // Asociar propiedad al arrendador
      await ArrendadorDB.findByIdAndUpdate(arrendadorId, {
        $push: { properties: property._id },
        updatedAt: new Date()
      });

      res.status(201).json({
        success: true,
        message: "Propiedad creada exitosamente",
        data: property
      });
    } catch (error: any) {
      // Manejo de errores de validación
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: error.errors
        });
      }

      // Error inesperado
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  /**
   * Obtener todas las propiedades de un arrendador (con paginación)
   */
  static async getPropertiesByArrendador(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.arrendadorId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Verificar que el arrendador existe
      const arrendador = await ArrendadorDB.findById(arrendadorId);
      if (!arrendador) {
        return res.status(404).json({
          success: false,
          message: "Arrendador no encontrado"
        });
      }

      // Obtener propiedades activas del arrendador
      const properties = await PropertyDB.find({
        _id: { $in: arrendador.properties },
        isActive: true
      })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });

      // Contar total de propiedades activas
      const total = await PropertyDB.countDocuments({
        _id: { $in: arrendador.properties },
        isActive: true
      });

      res.json({
        success: true,
        data: {
          properties,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProperties: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  /**
   * Obtener todas las propiedades (públicas)
   * - Soporta filtros opcionales: tipo, precio, servicios, amueblado, etc.
   * - Incluye paginación
   */
  static async getAllProperties(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Construcción de filtros dinámicos
      const filters: any = { isActive: true };

      if (req.query.propertyType) filters.propertyType = req.query.propertyType;
      if (req.query.rentalType) filters.rentalType = req.query.rentalType;
      if (req.query.genderPreference) filters.genderPreference = req.query.genderPreference;
      if (req.query.minPrice) filters.monthlyPrice = { $gte: parseInt(req.query.minPrice as string) };
      if (req.query.maxPrice) {
        filters.monthlyPrice = {
          ...filters.monthlyPrice,
          $lte: parseInt(req.query.maxPrice as string)
        };
      }
      if (req.query.includesServices) filters.includesServices = req.query.includesServices === 'true';
      if (req.query.isFurnished) filters.isFurnished = req.query.isFurnished === 'true';

      // Obtener propiedades con filtros aplicados
      const properties = await PropertyDB.find(filters)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });

      const total = await PropertyDB.countDocuments(filters);

      res.json({
        success: true,
        data: {
          properties,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProperties: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  /**
   * Obtener una propiedad específica por ID
   */
  static async getProperty(req: Request, res: Response) {
    try {
      const propertyId = req.params.propertyId;

      const property = await PropertyDB.findById(propertyId);
      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Propiedad no encontrada"
        });
      }

      res.json({
        success: true,
        data: property
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  /**
   * Actualizar una propiedad
   * - Valida los datos con Zod
   * - Actualiza la propiedad en la BD
   */
  static async updateProperty(req: Request, res: Response) {
    try {
      const propertyId = req.params.propertyId;
      const validatedData = UpdatePropertySchema.parse(req.body);

      const property = await PropertyDB.findByIdAndUpdate(
          propertyId,
          { ...validatedData, updatedAt: new Date() },
          { new: true, runValidators: true }
      );

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Propiedad no encontrada"
        });
      }

      res.json({
        success: true,
        message: "Propiedad actualizada exitosamente",
        data: property
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  /**
   * Eliminar propiedad (soft delete)
   * - Marca la propiedad como inactiva en lugar de borrarla
   * - Opcionalmente la elimina del array del arrendador
   */
  static async deleteProperty(req: Request, res: Response) {
    try {
      const propertyId = req.params.propertyId;
      const arrendadorId = req.params.arrendadorId;

      // Soft delete de la propiedad
      const property = await PropertyDB.findByIdAndUpdate(
          propertyId,
          {
            isActive: false,
            updatedAt: new Date()
          },
          { new: true }
      );

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Propiedad no encontrada"
        });
      }

      // Remover referencia del arrendador (opcional)
      if (arrendadorId) {
        await ArrendadorDB.findByIdAndUpdate(arrendadorId, {
          $pull: { properties: propertyId },
          updatedAt: new Date()
        });
      }

      res.json({
        success: true,
        message: "Propiedad eliminada exitosamente"
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  /**
   * Activar o desactivar propiedad
   * - Cambia el estado `isActive` de una propiedad
   */
  static async togglePropertyStatus(req: Request, res: Response) {
    try {
      const propertyId = req.params.propertyId;
      const { isActive } = req.body;

      const property = await PropertyDB.findByIdAndUpdate(
        propertyId,
        { 
          isActive: typeof isActive === 'boolean' ? isActive : true,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Propiedad no encontrada"
        });
      }

      res.json({
        success: true,
        message: `Propiedad ${property.isActive ? 'activada' : 'desactivada'} exitosamente`,
        data: property
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  /**
   * GET /api/propiedades/:arrendadorId/peticiones
   * Listar todas las peticiones del arrendador
   *
   * SEGURIDAD: Validación incompleta
   * TODO (PRODUCCIÓN): Validar ownership de propiedades
   * - Actualmente NO valida que arrendador es dueño de propiedades
   * - DEBE validar que cada petición pertenece a propiedad del arrendador
   * - DEBE filtrar peticiones solo de sus propiedades
   *
   * TODO (PRODUCCIÓN): Implementar logging y auditoría
   * - DEBE registrar qué arrendador vio qué peticiones
   * - DEBE alertar sobre acceso no autorizado
   * - DEBE mantener audit trail para compliance
   *
   * TODO (PRODUCCIÓN): Agregar límites de rate limiting
   * - Limitar llamadas para evitar data scraping
   * - Máx 60 peticiones/minuto por arrendador
   */
  static async listPeticiones(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.arrendadorId;
      const { propertyId } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      const arrendador = await ArrendadorDB.findById(arrendadorId).lean();
      if (!arrendador) {
        return res.status(404).json({ success: false, message: "Arrendador no encontrado" });
      }

      // Filter petitions by landlord's properties
      const propiedadesDelArrendador = await PropiedadRentaDB.find({ propietarioId: arrendadorId }).select("_id titulo tipoPropiedad ubicacion informacionFinanciera imagenes").lean();
      const propertyIds = propiedadesDelArrendador.map((p: any) => p._id);
      const propertyMap = new Map(propiedadesDelArrendador.map((p: any) => [p._id.toString(), p]));

      const filter: any = { propertyId: { $in: propertyIds } };
      if (propertyId) filter.propertyId = propertyId;

      const peticiones = await PeticionDB.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const total = await PeticionDB.countDocuments(filter);

      // Attach property data to each petition
      const populated = peticiones.map((pet: any) => {
        const prop = propertyMap.get(pet.propertyId?.toString());
        return {
          ...pet,
          propertyData: prop ? {
            titulo: (prop as any).titulo,
            tipoPropiedad: (prop as any).tipoPropiedad,
            direccion: (prop as any).ubicacion?.direccion || (prop as any).ubicacion?.calle || "",
            campus: (prop as any).ubicacion?.campus,
            precioMensual: (prop as any).informacionFinanciera?.precioMensual,
            imagen: (prop as any).imagenes?.fachada?.[0] || (prop as any).imagenes?.interior?.[0] || "",
          } : null,
        };
      });

      return res.status(200).json({
        success: true,
        data: populated,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Error al listar peticiones",
        error: error.message
      });
    }
  }

  /**
   * GET /api/propiedades/:arrendadorId/peticiones/:peticionId
   * Ver detalle de una petición específica
   *
   * SEGURIDAD: Sin validación de ownership
   * TODO (PRODUCCIÓN): Validar que petición pertenece a propiedad del arrendador
   * - DEBE verificar que propertyId de petición pertenece a arrendador
   * - DEBE rechazar si propiedad no pertenece al arrendador
   *
   * TODO (PRODUCCIÓN): Implementar logging
   * - DEBE registrar acceso a peticiones sensibles
   * - DEBE alertar sobre accesos sospechosos (ej: muchos accesos rápidos)
   *
   * TODO (PRODUCCIÓN): Data sanitization
   * - Asegurar que no hay datos no permitidos en respuesta
   * - Auditar que extractVisibleUserData funciona correctamente
   */
  static async getPeticion(req: Request, res: Response) {
    try {
      const { peticionId, arrendadorId } = req.params;

      const arrendador = await ArrendadorDB.findById(arrendadorId).lean();
      if (!arrendador) {
        return res.status(404).json({ success: false, message: "Arrendador no encontrado" });
      }

      const peticion = await PeticionDB.findById(peticionId).lean();
      if (!peticion) {
        return res.status(404).json({ success: false, message: "Petición no encontrada" });
      }

      // TODO (PRODUCCIÓN): Validar que petición pertenece a propiedad del arrendador
      // const propiedad = await PropiedadRentaDB.findById(peticion.propertyId);
      // if (!propiedad || propiedad.propietarioId !== arrendadorId) {
      //   logUnauthorizedAccess(arrendadorId, peticionId);
      //   return res.status(403).json({ success: false, message: "No autorizado" });
      // }

      // TODO (PRODUCCIÓN): Loguear acceso a petición para auditoría
      // logPeticionAccess(arrendadorId, peticionId);

      return res.status(200).json({ success: true, data: peticion });
    } catch (error: any) {
      // TODO (PRODUCCIÓN): Loguear errores sin exposición
      return res.status(500).json({
        success: false,
        message: "Error al obtener petición",
        error: error.message
      });
    }
  }
}
