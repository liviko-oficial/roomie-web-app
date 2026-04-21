import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";

import db from "@/db/index";
import cookieParser from "cookie-parser";
import { PORT } from "@/lib/const";
import api from "./src/api";

await db();

const app = express();

// Security & performance middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Rate limiting — general
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Demasiadas peticiones, intenta de nuevo en un minuto" },
}));

// Rate limiting — auth endpoints (mas estricto)
app.use("/api/arrendadores/login", rateLimit({ windowMs: 60 * 1000, max: 20 }));
app.use("/api/arrendadores/register", rateLimit({ windowMs: 60 * 1000, max: 10 }));
app.use("/api/users/login", rateLimit({ windowMs: 60 * 1000, max: 20 }));

app.use("/api", api);

// Global error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}:`, err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Error interno del servidor" : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}\nAPI docs at http://localhost:${PORT}/api/docs/`);
});
