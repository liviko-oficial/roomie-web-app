import { User, UserPartial } from "@/user/models/userMissing.schema";
import { CookieOptions, NextFunction, Request, Response } from "express";
import { PERMITIONS } from "../../lib/const";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/const";
import { Types } from "mongoose";
export type RequestWithUser = Request & {
  user: {
    _id: User["_id"] | Types.ObjectId;
    email: User["email"] | UserPartial["email"];
    permitions: (typeof PERMITIONS)[keyof typeof PERMITIONS];
  };
};
const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24, // 1 día
};
export const add_session_cookie = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const value = jwt.sign(user, JWT_SECRET);
  res.cookie("session", value, COOKIE_OPTIONS);
  next();
};
