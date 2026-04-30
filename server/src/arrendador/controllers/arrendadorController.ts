import { Request, Response } from "express";
import { ArrendadorDB } from "../models/arrendador.schema";
import {
  CreateArrendadorSchema,
  UpdateArrendadorSchema,
  UpdateArrendadorProfileSchema,
  ArrendadorLoginSchema,
  ChangePasswordSchema
} from "../validation/arrendador.validation";
import { ArrendadorAuthSubmissionSchema } from "../models/arrendadorAuth.schema";
import { make_hash, compare_hash, generateToken } from "../lib/utils";

export class ArrendadorController {
  /**
   * Registro de arrendador
   * - Válida los datos de entrada con Zod
   * - Verifica si el email ya está registrado
   * - Hashea la contraseña antes de guardarla
   * - Crea un nuevo arrendador en la BD
   * - Genera y devuelve un token JWT
   */
  static async register(req: Request, res: Response) {
    try {
      const validatedData = ArrendadorAuthSubmissionSchema.parse(req.body);

      // Verificar si el email ya existe en la base de datos
      const existingArrendador = await ArrendadorDB.findOne({ email: validatedData.email });
      if (existingArrendador) {
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado"
        });
      }

      // Generar hash de la contraseña antes de guardarla
      const hashedPassword = await make_hash(validatedData.password);

      // Crear instancia del arrendador con los datos validados
      const arrendador = new ArrendadorDB({
        ...validatedData,
        password: hashedPassword,
      });

      await arrendador.save();

      // Generar token JWT para autenticación
      const token = generateToken(String(arrendador._id), arrendador.email);

      res.status(201).json({
        success: true,
        message: "Arrendador registrado exitosamente",
        data: {
          id: String(arrendador._id),
          email: arrendador.email,
          token
        }
      });
    } catch (error: any) {
      // Manejo de errores de validación de Zod
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: error.errors
        });
      }

      // Error inesperado en el servidor
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  /**
   * Login de arrendador
   * - Válida credencial
   * - Verifica existencia del arrendador y su estado activo
   * - Compara contraseñas hasheadas
   * - Genera un token JWT si las credenciales son correctas
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = ArrendadorLoginSchema.parse(req.body);

      // Buscar arrendador activo e incluir contraseña en la selección
      const arrendador = await ArrendadorDB.findOne({
        email,
        isActive: true
      }).select('+password');

      if (!arrendador) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas"
        });
      }

      // Comparar la contraseña ingresada con el hash almacenado
      const isPasswordValid = await compare_hash(password, arrendador.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas"
        });
      }

      // Generar token JWT
      const token = generateToken(String(arrendador._id), arrendador.email);

      res.json({
        success: true,
        message: "Login exitoso",
        data: {
          id: String(arrendador._id),
          email: arrendador.email,
          token,
          isEmailVerified: arrendador.isEmailVerified
        }
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
   * Obtener perfil de arrendador por ID
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.id;

      // Buscar arrendador por ID
      const arrendador = await ArrendadorDB.findById(arrendadorId);

      if (!arrendador) {
        return res.status(404).json({
          success: false,
          message: "Arrendador no encontrado"
        });
      }

      res.json({
        success: true,
        data: arrendador
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
   * Obtener lista de todos los arrendadores activos con paginación
   */
  static async getAllArrendadores(req: Request, res: Response) {
    try {
      // Configuración de paginación
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Buscar arrendadores activos, omitiendo el campo contraseña
      const arrendadores = await ArrendadorDB.find({ isActive: true })
          .select('-password')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });

      // Contar total de arrendadores activos
      const total = await ArrendadorDB.countDocuments({ isActive: true });

      res.json({
        success: true,
        data: {
          arrendadores,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalArrendadores: total,
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
   * Actualizar arrendador completo (todos los campos)
   */
  static async updateArrendador(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.id;
      const validatedData = UpdateArrendadorSchema.parse(req.body);

      // Actualizar arrendador con los nuevos datos
      const arrendador = await ArrendadorDB.findByIdAndUpdate(
          arrendadorId,
          { ...validatedData, updatedAt: new Date() },
          { new: true, runValidators: true }
      );

      if (!arrendador) {
        return res.status(404).json({
          success: false,
          message: "Arrendador no encontrado"
        });
      }

      res.json({
        success: true,
        message: "Arrendador actualizado exitosamente",
        data: arrendador
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
   * Actualizar únicamente el perfil del arrendador
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.id;
      const validatedData = UpdateArrendadorProfileSchema.parse(req.body);

      // Actualizar solamente el campo profile
      const arrendador = await ArrendadorDB.findByIdAndUpdate(
          arrendadorId,
          {
            profile: validatedData,
            updatedAt: new Date()
          },
          { new: true, runValidators: true }
      );

      if (!arrendador) {
        return res.status(404).json({
          success: false,
          message: "Arrendador no encontrado"
        });
      }

      res.json({
        success: true,
        message: "Perfil actualizado exitosamente",
        data: arrendador
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
   * Subir foto de perfil
   * - Recibe multipart con un archivo en campo "photo"
   * - El middleware uploadProfilePhoto sube a Cloudinary
   * - Guarda la URL en profile.profilePicture
   */
  static async uploadProfilePhoto(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.id;
      const file = (req as Request & { file?: Express.Multer.File & { path: string } }).file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No se recibio archivo (campo 'photo')"
        });
      }

      const photoUrl = file.path;

      const arrendador = await ArrendadorDB.findByIdAndUpdate(
        arrendadorId,
        {
          $set: {
            "profile.profilePicture": photoUrl,
            updatedAt: new Date(),
          }
        },
        { new: true, runValidators: false }
      );

      if (!arrendador) {
        return res.status(404).json({
          success: false,
          message: "Arrendador no encontrado"
        });
      }

      res.json({
        success: true,
        message: "Foto de perfil actualizada",
        data: { profilePicture: photoUrl }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error al subir foto de perfil",
        error: error.message
      });
    }
  }

  /**
   * Cambiar contraseña de arrendador
   * - Verifica la contraseña actual
   * - Hashea la nueva contraseña antes de guardarla
   */
  static async changePassword(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.id;
      const { currentPassword, newPassword } = ChangePasswordSchema.parse(req.body);

      // Buscar arrendador con contraseña
      const arrendador = await ArrendadorDB.findById(arrendadorId).select('+password');
      if (!arrendador) {
        return res.status(404).json({
          success: false,
          message: "Arrendador no encontrado"
        });
      }

      // Verificar que la contraseña actual sea válida
      const isCurrentPasswordValid = await compare_hash(currentPassword, arrendador.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "La contraseña actual es incorrecta"
        });
      }

      // Generar hash de la nueva contraseña
      const hashedNewPassword = await make_hash(newPassword);

      await ArrendadorDB.findByIdAndUpdate(arrendadorId, {
        password: hashedNewPassword,
        updatedAt: new Date()
      });

      res.json({
        success: true,
        message: "Contraseña actualizada exitosamente"
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
   * Eliminar arrendador (soft delete)
   * - No elimina el documento, solo marca `isActive` como false
   */
  static async deleteArrendador(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.id;

      // Soft delete: desactivar arrendador en lugar de eliminarlo
      const arrendador = await ArrendadorDB.findByIdAndUpdate(
          arrendadorId,
          {
            isActive: false,
            updatedAt: new Date()
          },
          { new: true }
      );

      if (!arrendador) {
        return res.status(404).json({
          success: false,
          message: "Arrendador no encontrado"
        });
      }

      res.json({
        success: true,
        message: "Arrendador eliminado exitosamente"
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
