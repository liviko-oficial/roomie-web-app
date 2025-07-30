import bcrypt from "bcrypt";
import { CookieOptions, Response } from "express";
const SALT_ROUNDS = 15;
export const make_hash = async (pass: string) => {
  const hash = await bcrypt.hash(pass, SALT_ROUNDS);
  return hash;
};
export const verify_password = async (pass: string, hash: string) => {
  return await bcrypt.compare(pass, hash);
};

export const delete_cookie = (key: string, res: Response) => {
  const COOKIE_OPTIONS: CookieOptions = {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  };
  res.clearCookie(key, COOKIE_OPTIONS);
  return res;
};
