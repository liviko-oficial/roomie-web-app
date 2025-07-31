import { Router } from "express";
import register from "./resgister";
import login from "./login";
import password_recovery from "./password_recovery";
const app = Router();
app.use("/", register);
app.use("/", login);
app.use("/", password_recovery);
export default app;
