import z from "zod";
import { BASE_URL, FROM_EMAIL } from "@/lib/const";
import resend from "@/lib/resend_instance";
import { tokens_system } from "@/user/models/passwordRecovery";
import { UserDB, UserPartialDB } from "@/user/models/userMissing.schema";
import { NextFunction, Request, Response, Router } from "express";
import EmailTemplate from "@/email_templates/PasswordRecovery.tsx";
import { PERMISSIONS, RECOVERY_COOKIE_KEY } from "@/user/lib/const";
import {
  add_password_recovery_cookie,
  decode_password_request_cookie,
  RequestWithUser,
} from "@/user/routes/middleware/jwt";
import { AuthSubmissionSchema } from "@/user/models/userAuth.schema";
import { get_db } from "@/db/querry.user";
import { make_hash } from "@/user/lib/utils";

const send_email = async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "No email provided" });
  let user = await UserDB.findOne({ email });
  !user && (user = await UserPartialDB.findOne({ email }));
  if (!user) {
    console.error("user not found");
    return res.sendStatus(200);
  }
  const token = tokens_system.get_token({ email });
  const url = `${BASE_URL}/api/password-recovery/verify?email=${email}&token=${token}`;
  try {
    await resend.emails.send({
      subject: "Cambio de contraseña",
      from: FROM_EMAIL,
      // TODO: Implement dev env variable to switch between these options
      //  [req.body.email] and ["liviko.oficial@gmail.com"]
      to: ["liviko.oficial@gmail.com"],
      react: EmailTemplate({ code: token, url }),
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something unexpected " +
          "happened" });
  }
};
const SubmissionShema = z.object({
  email: z.string().email().max(40).min(1),
  token: z.string().uuid(),
});
type SubmissionShema = {
  email: string;
  token: string;
};
type RequestWithEmail = Request & { email: string };
const verify_petition = (
  req: RequestWithEmail,
  res: Response,
  next: NextFunction
) => {
  const { email, token } = req.query;
  if (!email || !token)
    res.status(400).json({ error: "Email or token not provided" });
  const submission = SubmissionShema.safeParse({
    email,
    token,
  });
  if (!submission.success)
    return res
      .status(400)
      .json({ error: "Something went wrong with the shema of data" });
  const isVerify = tokens_system.verify(submission.data as SubmissionShema);
  if (!isVerify) return res.status(401).json({ error: "Verification error" });
  req.email = submission.data.email;
  next();
};
export type UserChange = {
  user: {
    _id: string;
    token: string;
    email: string;
    permissions: RequestWithUser["user"]["permissions"];
  };
};
const query_db = async (
  req: RequestWithEmail & UserChange,
  res: Response,
  next: NextFunction
) => {
  let user: UserChange["user"];
  user = await UserDB.findOne({ email: req.email });
  user && (user.permissions = PERMISSIONS["USER"]);
  if (!user) {
    user = await UserPartialDB.findOne({ email: req.email });
    user.permissions = PERMISSIONS["PARTIAL"];
  }
  if (!user) return res.sendStatus(200);
  const token = tokens_system.get_token({ email: user.email });
  req.email = undefined;
  req.user = {
    _id: user._id,
    email: user.email,
    permissions: user.permissions,
    token,
  };
  next();
};
const change_password = async (req: Request, res: Response) => {
  const { password: submission_password } = req.body;
  if (!submission_password)
    res.status(400).json({ error: "No password was provided" });
  const { success, data: new_password } =
    AuthSubmissionSchema.shape.password.safeParse(submission_password);
  if (!success) res.status(400).json({ error: "Password format error" });
  const cookie = req.cookies[RECOVERY_COOKIE_KEY];
  if (!cookie) res.status(400).json({ error: "No cookie provided" });
  const user = decode_password_request_cookie(cookie);
  const isVerify = tokens_system.verify({
    email: user.email,
    token: user.token,
  });
  if (!isVerify) res.status(401).json({ error: "Something went wrong" });
  const db = get_db({ permissions: user.permissions });
  const hash_password = await make_hash(new_password);
  try {
    await db.findByIdAndUpdate(user._id, {
      password: hash_password,
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong with db" });
  }
};
// passmanager routes
const app = Router();
app.get("/password-recovery", send_email);
app.get(
  "/password-recovery/verify",
  verify_petition,
  query_db,
  add_password_recovery_cookie,
  (_, res) => res.sendStatus(200)
);
app.put("/password-recovery", change_password);
export default app;
