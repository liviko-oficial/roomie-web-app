import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/utils";
import { ArrendadorDB } from "../models/arrendador.schema";

// 🔹 Extensión del tipo Request de Express para incluir información del arrendador autenticado
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

/**
 * Middleware de autenticación para arrendadores
 * - Verifica que el request incluya un token JWT válido en el header `Authorization`
 * - Decodifica el token y valida que tenga el rol de `arrendador`
 * - Confirma que el arrendador existe en la base de datos y que está activo
 * - Adjunta los datos del arrendador autenticado al objeto `req`
 */
export const authenticateArrendador = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");

    // Validar que se haya enviado el header con formato correcto
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido"
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verificar y decodificar el token
    const decoded = verifyToken(token);

    // Validar que el rol del token sea de arrendador
    if (decoded.role !== "arrendador") {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. Token de arrendador requerido"
      });
    }

    // Confirmar que el arrendador existe en la BD y sigue activo
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

    // Adjuntar información del arrendador al request para uso posterior
    req.arrendador = {
      id: decoded.arrendadorId,
      email: decoded.email,
      role: decoded.role
    };

    // Continuar con el siguiente middleware o controlador
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};

/**
 * Middleware de autorización para verificar propiedad de recursos
 * - Se asegura de que el arrendador autenticado solo pueda acceder/modificar sus propios recursos
 * - Compara el ID en los parámetros de la ruta con el ID del arrendador autenticado
 * @param paramName - Nombre del parámetro en la URL que contiene el ID del arrendador propietario
 */
export const checkOwnership = (paramName: string = "arrendadorId") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const resourceOwnerId = req.params[paramName];
    const currentArrendadorId = req.arrendador?.id;

    // Validar que el arrendador esté autenticado
    if (!currentArrendadorId) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
    }

    // Verificar que el arrendador autenticado es el dueño del recurso
    if (resourceOwnerId !== currentArrendadorId) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para acceder a este recurso"
      });
    }

    // Continuar si la validación pasa
    next();
  };
};
