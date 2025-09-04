import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/utils";
import { ArrendadorDB } from "../models/arrendador.schema";

// Extender el tipo Request para incluir arrendador
declare global {
  namespace Express {
    interface Request {
      arrendador?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateArrendador = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido"
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verificar token
    const decoded = verifyToken(token);
    
    if (decoded.role !== "arrendador") {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. Token de arrendador requerido"
      });
    }

    // Verificar que el arrendador existe y está activo
    const arrendador = await ArrendadorDB.findOne({
      _id: decoded.arrendadorId,
      isActive: true
    });

    if (!arrendador) {
      return res.status(401).json({
        success: false,
        message: "Token inválido o arrendador no encontrado"
      });
    }

    // Adjuntar información del arrendador al request
    req.arrendador = {
      id: decoded.arrendadorId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};

export const checkOwnership = (paramName: string = "arrendadorId") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const resourceOwnerId = req.params[paramName];
    const currentArrendadorId = req.arrendador?.id;

    if (!currentArrendadorId) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
    }

    if (resourceOwnerId !== currentArrendadorId) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para acceder a este recurso"
      });
    }

    next();
  };
};