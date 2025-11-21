import { PERMISSIONS, SESSION_COOKIE_KEY } from "@/user/lib/const";
import { delete_cookie } from "@/user/lib/utils";
import { UserPartialDB } from "@/user/models/userMissing.schema";
import {
    decode_session_cookie,
    RequestWithUser,
} from "@/user/routes/middleware/jwt";
import { NextFunction, Response } from "express";

function isInDB(user: RequestWithUser["user"]): boolean {
    const db = {
        [PERMISSIONS["PARTIAL"]]: UserPartialDB,
        [PERMISSIONS["USER"]]: UserPartialDB,
    }[user.permissions];
    return !!db.findById(user._id);
}

export const require_auth = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    const cookies = req.cookies;
    if (!(SESSION_COOKIE_KEY in cookies)) {
        res.status(401).json({error: "session cookie missing"});
        return;
    }
    const {session: session_token} = cookies;
    try {
        const user = decode_session_cookie(session_token);
        if (!isInDB(user)) {
            throw new Error("user not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res = delete_cookie(SESSION_COOKIE_KEY, res);
        console.error(error);
        res.status(401).json({error: "auth error in request"});
    }
};
