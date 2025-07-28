import { Router } from "express";
import register from "./resgister";
const app = Router();
app.use("/", register);
export default app;
