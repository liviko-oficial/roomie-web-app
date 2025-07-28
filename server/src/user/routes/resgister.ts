import { register_user } from "@/user/models/register.model";
import { Request, Router } from "express";

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
export default app;
