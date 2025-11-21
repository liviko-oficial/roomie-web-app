import { delete_user, get_db, get_user } from "@/db/querry.user";
import { RealUser } from "@/lib/types";
import { PERMISSIONS, SESSION_COOKIE_KEY } from "@/user/lib/const";
import { delete_cookie, verify_password } from "@/user/lib/utils";
import { UserResponse } from "@/user/models/user.client";
import { AuthSubmissionSchema } from "@/user/models/userAuth.schema";
import type { AuthSubmissionSchema as SubmissionUser } from "@/user/models/userAuth.schema";
import { UserDB, UserPartialDB } from "@/user/models/userMissing.schema";
import type { User } from "@/user/models/userMissing.schema";
import {
    add_session_cookie,
    RequestWithUser,
} from "@/user/routes/middleware/jwt";
import { require_auth } from "@/user/routes/middleware/login.middleware";
import {
    NextFunction,
    Request,
    RequestHandler,
    Response,
    Router,
} from "express";

const app = Router();

// Handlers and middlewares
// Verify Shema
type RequestWithUserSubmission = Request & { submission: SubmissionUser };

function verify_submission_shema(
    req: RequestWithUserSubmission,
    res: Response,
    next: NextFunction
) {
    const parse_data = AuthSubmissionSchema.safeParse(req.body);
    if (!parse_data.success) {
        res.status(400).json({error: parse_data.error.issues[0].message});
        return;
    }
    req.submission = parse_data.data;
    next();
}

type Password = { password: string };
type UserQuery = null | (User & Password);

async function verify_user_db(
    req: RequestWithUserSubmission & { user: RequestWithUser["user"] },
    res: Response,
    next: NextFunction
) {
    const {email, password} = req.submission;
    const query_db = async (): Promise<
        null | (RequestWithUser["user"] & Password)
    > => {
        let user: UserQuery;
        user = await UserPartialDB.findOne({email}).select({password: true});
        if (user) {
            return {
                _id: user._id,
                email,
                permissions: PERMISSIONS["PARTIAL"],
                password: user.password,
            };
        }
        user = await UserDB.findOne({email}).select({password: true});
        if (user) {
            return {
                _id: user._id,
                email,
                permissions: PERMISSIONS["USER"],
                password: user.password,
            };
        }
        return null;
    };
    const user = await query_db();
    if (!user) res.status(404).json({error: "User Not Found"});
    const isCorrectPassword = await verify_password(password, user.password);
    if (!isCorrectPassword) res.status(400).json({error: "User not Found"});
    req.user = {_id: user._id, email, permissions: user.permissions};
    next();
}

const manage_redirects: RequestHandler = (req, res) => {
    if (!("redirect" in req.query)) {
        res.status(200).redirect("/api/user");
        return;
    }
    const {redirect, ...otherParams} = req.query;
    const path = decodeURIComponent(redirect as string);
    let params = Object.entries(otherParams);
    if (params.length === 0 && path !== "none") res.status(200).redirect(path);
    if (params.length === 0) res.sendStatus(200);
    const string_params = params.reduce(
        (prev, [key, value]) => prev + `${key}=${value}`,
        "?"
    );
    res.status(200).redirect(path + string_params);
};

async function upgrade_user(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) {
    if (req.user.permissions !== PERMISSIONS["PARTIAL"])
        res.status(200).json({error: "Permissions not match endpoint"});
    const user = await UserPartialDB.findById(req.user._id);
    if (!user) {
        console.error(
            `Partial user not found in partial db: {id:${req.user._id}, email:${req.user.email}}`
        );
        res.status(500).json({error: "No user found to upgrade"});
    }
    const new_user = RealUser.safeParse(user);
    if (!new_user.success)
        return res.status(400).json({error: "Shema error of request"});
    const {data} = new_user;
    await UserPartialDB.findByIdAndDelete(user._id);
    const user_db = new UserDB(data);
    try {
        await user_db.save();
        res = delete_cookie(SESSION_COOKIE_KEY, res);
        req.user = {
            _id: user_db._id,
            email: user_db.email,
            permissions: PERMISSIONS["USER"],
        };
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Something unexpected happened"});
    }
}

const change_preferences = async (req: RequestWithUser, res: Response) => {
    const {preferences: submitted_data} = req.body;
    if (!submitted_data)
        return res.status(400).json({error: "No preferences to change found"});
    const {_id} = req.user;
    const db = get_db(req.user);
    const user_db = await db.findById(_id);
    const {
        data: parse_preferences,
        success,
        error,
    } = UserResponse.partial().shape.preferences.safeParse(submitted_data);
    if (!success) res.status(400).json({error: error.issues[0].message});
    user_db.preferences = {...user_db.preferences, ...parse_preferences};
    try {
        const new_preferences = await user_db.save();
        res.status(200).json({preferences: new_preferences.preferences});
    } catch (_) {
        res.status(500).json({error: "Error saving the data on Database"});
    }
};
const change_user = async (req: RequestWithUser, res: Response) => {
    if (!req.body)
        return res.status(400).json({error: "No preferences to change found"});
    const {_id} = req.user;
    const db = get_db(req.user);
    const user_db = await db.findById(_id);
    const {
        data: parse_changes,
        success,
        error,
    } = RealUser.partial().shape.preferences.safeParse(req.body);
    if (!success) res.status(400).json({error: error.issues[0].message});
    user_db.preferences = {...user_db.preferences, ...parse_changes};
    try {
        const new_preferences = await user_db.save();
        res.status(200).json({...UserResponse.parse(new_preferences)});
    } catch (_) {
        res.status(500).json({error: "Error saving the data on Database"});
    }
};
// Rutas
app.post(
    "/login",
    verify_submission_shema,
    verify_user_db,
    add_session_cookie,
    manage_redirects
);
app.get(
    "/login/upgrade-partial",
    require_auth,
    upgrade_user,
    add_session_cookie,
    (_, res) => res.sendStatus(200)
);
app.get("/user", require_auth, async (req: RequestWithUser, res) => {
    try {
        const user = await get_user(req.user);
        if (!user) {
            console.error("Error while getting user from db");
            res.sendStatus(500);
        }
        if (req.user.permissions === PERMISSIONS["PARTIAL"]) {
            const response_user = UserResponse.partial().parse(user);
            res.status(200).json(response_user);
            return;
        }
        const response_user = UserResponse.parse(user);
        res.status(200).json(response_user);
    } catch (error) {
        console.error(`Unexpected error while getting user from db: \n${error}`);
        res.sendStatus(500);
    }
});
app.delete("/user", require_auth, async (req: RequestWithUser, res) => {
    try {
        const user = await delete_user(req.user);
        if (!user) {
            console.error("Error while deleting user from db");
            res.sendStatus(500);
            return;
        }
        res = delete_cookie(SESSION_COOKIE_KEY, res);
        res.status(200).json({user});
    } catch (error) {
        console.error(`Unexpected error while deleting user from db: \n${error}`);
        res.sendStatus(500);
    }
});
app.put("/user/preferences", require_auth, change_preferences);
app.put("/user", require_auth, change_user);
export default app;
