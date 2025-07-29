import { delete_user, get_user } from "@/db/querry.user";
import { PERMITIONS, SESSION_COOKIE_KEY } from "@/user/lib/const";
import { delete_cookie, verify_password } from "@/user/lib/utils";
import { UserResponse } from "@/user/models/user.client";
import { AuthSubmitionSchema } from "@/user/models/userAuth.schema";
import type { AuthSubmitionSchema as SubmitionUser } from "@/user/models/userAuth.schema";
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
// Verify Shema
type RequestWithUserSubmition = Request & { submition: SubmitionUser };
function verify_submtion_shema(
  req: RequestWithUserSubmition,
  res: Response,
  next: NextFunction
) {
  const parse_data = AuthSubmitionSchema.safeParse(req.body);
  if (!parse_data.success) {
    res.status(400).json({ error: parse_data.error.issues[0].message });
    return;
  }
  req.submition = parse_data.data;
  next();
}
type Password = { password: string };
type UserQuerry = null | (User & Password);
async function verify_user_db(
  req: RequestWithUserSubmition & { user: RequestWithUser["user"] },
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.submition;
  const qurey_db = async (): Promise<
    null | (RequestWithUser["user"] & Password)
  > => {
    let user: UserQuerry;
    user = await UserPartialDB.findOne({ email }).select({ password: true });
    if (user) {
      return {
        _id: user._id,
        email,
        permitions: PERMITIONS["PARTIAL"],
        password: user.password,
      };
    }
    user = await UserDB.findOne({ email }).select({ password: true });
    if (user) {
      return {
        _id: user._id,
        email,
        permitions: PERMITIONS["PARTIAL"],
        password: user.password,
      };
    }
    return null;
  };
  const user = await qurey_db();
  if (!user) res.status(404).json({ error: "User Not Found" });
  const isCorrectPassword = await verify_password(password, user.password);
  if (!isCorrectPassword) res.status(400).json({ error: "User not Found" });
  req.user = { _id: user._id, email, permitions: user.permitions };
  next();
}
const manage_redirects: RequestHandler = (req, res) => {
  if (!("redirect" in req.query)) {
    res.status(200).redirect("/api/user");
    return;
  }
  const { redirect, ...otherParams } = req.query;
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
app.post(
  "/login",
  verify_submtion_shema,
  verify_user_db,
  add_session_cookie,
  manage_redirects
);
app.get("/user", require_auth, async (req: RequestWithUser, res) => {
  try {
    const user = await get_user(req.user);
    if (!user) throw Error("Error in db");
    if (req.user.permitions === PERMITIONS["PARTIAL"]) {
      const response_user = UserResponse.partial().parse(user);
      res.status(200).json(response_user);
      return;
    }
    const response_user = UserResponse.parse(user);
    res.status(200).json(response_user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
app.delete("/user", require_auth, async (req: RequestWithUser, res) => {
  try {
    const user = await delete_user(req.user);
    if (!user) throw Error("Error in db");
    res = delete_cookie(SESSION_COOKIE_KEY, res);
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
export default app;
