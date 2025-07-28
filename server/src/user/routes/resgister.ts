import { register_user } from "@/user/models/register.model";
import { Request, Router } from "express";
import emailValidator from "@/user/models/emailVerification";
import { UserPartial, UserPartialDB } from "@/user/models/userMissing.schema";
import {
  add_session_cookie,
  RequestWithUser,
} from "@/user/routes/middleware/jwt";
import { PERMITIONS } from "@/user/lib/const";
type withToken = Request & { token: string };
const app = Router();
app.post(
  "/register",
  async (req: withToken, res, next) => {
    try {
      const token = await register_user(req.body);
      req.token = token;
      next();
    } catch (error) {
      console.error(error.name);
      res.status(400).json({ error: error.message });
    }
  },
  (req: withToken, res) => {
    const token = req.token;
    res.json({ token });
  }
);
app.get(
  "/register/verify",
  async (req: RequestWithUser, res, next) => {
    const { email, token } = req.query;
    const result = emailValidator.verify({ token, email });
    if (result.success === false) {
      res.status(400).json({ error: result.error });
      return;
    }
    const parse_user = UserPartial.safeParse({ ...result.user, email });
    if (!parse_user.success) {
      console.log(parse_user.error.issues);
      res.status(400).json({ error: parse_user.error.issues[0].message });
      return;
    }
    const new_partial_user = new UserPartialDB(parse_user.data);
    await new_partial_user.save();
    req.user = {
      _id: new_partial_user._id,
      email: new_partial_user.email,
      permitions: PERMITIONS["PARTIAL"],
    };
    next();
    // TODO cron job para eliminar partial user cada x tiempo
  },
  add_session_cookie,
  (_, res) => res.sendStatus(200)
);
export default app;
