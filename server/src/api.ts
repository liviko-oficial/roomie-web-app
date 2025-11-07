import { Router } from "express";
import user from "@/user/routes";
import arrendador from "@/arrendador/routes";
import rentalProperty from "@/rentalProperty/routes";
const app = Router();

app.get("/", (_, res) => {
  res.send("<h1>You are tring to reach the API</h1>");
});

app.get("/health-check", (_, res) => {
  res.status(200).send("Server is running OK");
});

app.use(user);
app.use("/api", arrendador);
app.use("/api", rentalProperty);
app.use((_, res) => {
  res.status(404).send("<h1>API rounte not found</h1>");
});

export default app;
