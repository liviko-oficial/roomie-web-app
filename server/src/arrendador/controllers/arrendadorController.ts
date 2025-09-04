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
  // Registro de arrendador
  static async register(req: Request, res: Response) {
    try {
      const validatedData = ArrendadorAuthSubmissionSchema.parse(req.body);
      
      // Verificar si el email ya existe
      const existingArrendador = await ArrendadorDB.findOne({ email: validatedData.email });
      if (existingArrendador) {
        return res.status(400).json({ 
          success: false, 
          message: "El email ya está registrado" 
        });
      }

      // Hash de la contraseña
      const hashedPassword = await make_hash(validatedData.password);
      
      // Crear arrendador
      const arrendador = new ArrendadorDB({
        ...validatedData,
        password: hashedPassword,
      });

      await arrendador.save();
      
      // Generar token
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

  // Login de arrendador
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = ArrendadorLoginSchema.parse(req.body);
      
      // Buscar arrendador con contraseña
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

      // Verificar contraseña
      const isPasswordValid = await compare_hash(password, arrendador.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas"
        });
      }

      // Generar token
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

  // Obtener perfil de arrendador
  static async getProfile(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.id;
      
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

  // Obtener todos los arrendadores
  static async getAllArrendadores(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const arrendadores = await ArrendadorDB.find({ isActive: true })
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

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

  // Actualizar arrendador completo
  static async updateArrendador(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.id;
      const validatedData = UpdateArrendadorSchema.parse(req.body);
      
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

  // Actualizar perfil de arrendador
  static async updateProfile(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.id;
      const validatedData = UpdateArrendadorProfileSchema.parse(req.body);
      
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

  // Cambiar contraseña
  static async changePassword(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.id;
      const { currentPassword, newPassword } = ChangePasswordSchema.parse(req.body);
      
      const arrendador = await ArrendadorDB.findById(arrendadorId).select('+password');
      if (!arrendador) {
        return res.status(404).json({
          success: false,
          message: "Arrendador no encontrado"
        });
      }

      // Verificar contraseña actual
      const isCurrentPasswordValid = await compare_hash(currentPassword, arrendador.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "La contraseña actual es incorrecta"
        });
      }

      // Hash de la nueva contraseña
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

  // Eliminar arrendador (soft delete)
  static async deleteArrendador(req: Request, res: Response) {
    try {
      const arrendadorId = req.params.id;
      
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