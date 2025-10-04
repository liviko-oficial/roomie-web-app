import { Router } from "express";
import register from "./resgister";
import login from "./login";
import password_recovery from "./password_recovery";
import user_form from "./user_form";

const app = Router();

app.use("/", register);
app.use("/", login);
app.use("/", password_recovery);
app.use("/", user_form);

export default app;
