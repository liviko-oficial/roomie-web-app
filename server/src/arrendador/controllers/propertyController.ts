import { Request, Response } from "express";
import { PropertyDB, ArrendadorDB } from "../models/arrendador.schema";
import {
  CreatePropertySchema,
  UpdatePropertySchema
} from "../validation/arrendador.validation";

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
}
