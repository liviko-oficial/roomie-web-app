import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Genera un hash seguro para una contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Hash de la contraseña
 */
export async function make_hash(password: string): Promise<string> {
  const saltRounds = 10; // Número de rondas de encriptación
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compara una contraseña en texto plano con su hash almacenado
 * @param password - Contraseña ingresada por el usuario
 * @param hash - Hash almacenado en la base de datos
 * @returns true si coinciden, false si no
 */
export async function compare_hash(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Genera un token JWT para un arrendador
 * - Incluye el id, email y rol
 * - Expira en 7 días
 * @param arrendadorId - ID del arrendador
 * @param email - Email del arrendador
 * @returns Token JWT firmado
 */
export function generateToken(arrendadorId: string, email: string): string {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(
      { arrendadorId, email, role: "arrendador" }, // Payload del token
      secret,
      { expiresIn: "7d" } // Tiempo de expiración
  );
}

/**
 * Verifica y decodifica un token JWT
 * @param token - Token JWT recibido
 * @returns Payload con arrendadorId, email y rol
 * @throws Error si el token no es válido o está expirado
 */
export function verifyToken(token: string): { arrendadorId: string; email: string; role: string } {
  const secret = process.env.JWT_SECRET!;
  return jwt.verify(token, secret) as { arrendadorId: string; email: string; role: string };
}
