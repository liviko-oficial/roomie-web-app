import { Router } from "express";
import register from "./resgister";
import login from "./login";
const app = Router();
app.use("/", register);
app.use("/", login);
export default app;
