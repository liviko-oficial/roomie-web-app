import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

import { API_DOCS_PATH } from "@/lib/const.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
app.use(arrendador);
app.use(rentalProperty);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(YAML.load(path.resolve(__dirname, API_DOCS_PATH))));

app.use((_, res) => {
  res.status(404).send("<h1>API rounte not found</h1>");
});

export default app;
