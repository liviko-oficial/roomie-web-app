import { register_user } from "@/user/models/register.model";
import { Request, Router } from "express";
import emailValidator from "@/user/models/emailVerification";
import { UserPartial, UserPartialDB } from "@/user/models/userMissing.schema";
import { MagicLink } from "@/email_templates/MagicLink.tsx";
import {
  add_session_cookie,
  RequestWithUser,
} from "@/user/routes/middleware/jwt";
import { PERMITIONS } from "@/user/lib/const";
import { BASE_URL } from "@/lib/const";
import resend from "@/lib/resend_instance";
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
  async (req: withToken, res) => {
    const token = req.token;
    // NOTE: Missing Domain to send real emails
    const { error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      // TODO: Implement dev env variable to switch between these options
      //  [req.body.email] and ["liviko.oficial@gmail.com"]
      to: ["liviko.oficial@gmail.com"],
      subject: "Verification Link",
      react: MagicLink({
        url: `${BASE_URL}/api/register/verify?email=${req.body.email}&token=${token}`,
        code: req.token,
      }),
    });

    if (error) {
      return res.status(400).json({ error });
    }
    // NOTE: Only for dev purposes, change for production
    res.status(200).json({ token });
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
    // TODO: cron job para eliminar partial user cada x tiempo
  },
  add_session_cookie,
  (_, res) => res.sendStatus(200)
);
export default app;
