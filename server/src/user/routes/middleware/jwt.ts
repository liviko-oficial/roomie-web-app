import { User, UserPartial } from "@/user/models/userMissing.schema";
import { CookieOptions, NextFunction, Request, Response } from "express";
import {
    PERMISSIONS,
    RECOVERY_COOKIE_KEY,
    SESSION_COOKIE_KEY,
} from "../../lib/const";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/const";
import { Types } from "mongoose";
import { UserChange } from "@/user/routes/password_recovery";

export type RequestWithUser = Request & {
    user: {
        _id: User["_id"] | Types.ObjectId;
        email: User["email"] | UserPartial["email"];
        permissions: (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
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
    res.cookie(SESSION_COOKIE_KEY, value, COOKIE_OPTIONS);
    next();
};

class JWTError extends Error {
    constructor(mess: string, name: string) {
        super(mess);
        this.name = name;
    }
}

export const add_password_recovery_cookie = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    const user = req.user;
    const value = jwt.sign(user, JWT_SECRET);
    res.cookie(RECOVERY_COOKIE_KEY, value, COOKIE_OPTIONS);
    next();
};
export const decode_session_cookie = (cookie: string) => {
    try {
        const payload = jwt.verify(cookie, JWT_SECRET);
        return payload as RequestWithUser["user"];
    } catch (error) {
        throw new JWTError(error, "verification-error");
    }
};
export const decode_password_request_cookie = (cookie: string) => {
    try {
        const payload = jwt.verify(cookie, JWT_SECRET);
        return payload as UserChange["user"];
    } catch (error) {
        throw new JWTError(error, "verification-error");
    }
};
