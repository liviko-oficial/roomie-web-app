import { Router } from "express";
import user from "@/user/routes";
const app = Router();
app.get("/", (_, res) => {
  res.send("<h1>You are tring to reach the API</h1>");
});
app.use(user);
app.use((_, res) => {
  res.status(404).send("<h1>API rounte not found</h1>");
});
export default app;
