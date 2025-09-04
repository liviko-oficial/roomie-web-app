import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export async function make_hash(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function compare_hash(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(arrendadorId: string, email: string): string {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.sign({ arrendadorId, email, role: "arrendador" }, secret, { expiresIn: "7d" });
}

export function verifyToken(token: string): { arrendadorId: string; email: string; role: string } {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.verify(token, secret) as { arrendadorId: string; email: string; role: string };
}