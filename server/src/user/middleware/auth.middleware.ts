import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "@/lib/const";
import jwt from "jsonwebtoken";
import { UserDB, UserPartialDB } from "../models/userMissing.schema";
import { SESSION_COOKIE_KEY } from "../lib/const";

declare global {
  namespace Express {
    interface Request {
      student?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authenticateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // 1. Check Authorization header (API calls)
    const authHeader = req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "");
    }

    // 2. Fallback to session cookie (browser calls)
    if (!token && req.cookies?.[SESSION_COOKIE_KEY]) {
      token = req.cookies[SESSION_COOKIE_KEY];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Autenticación requerida" });
    }

    const decoded = jwt.verify(token, JWT_SECRET!) as {
      _id: string;
      email: string;
      permissions: string;
    };

    // Verify user exists in DB
    const user = await UserDB.findById(decoded._id) || await UserPartialDB.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Usuario no encontrado" });
    }

    req.student = {
      id: decoded._id,
      email: decoded.email,
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
