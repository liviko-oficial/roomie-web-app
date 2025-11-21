import express from "express";

import db from "@/db/index";
import cookieParser from "cookie-parser";
import { PORT } from "@/lib/const";
import api from "./src/api";
await db();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api", api);
app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}\nAPI docs at http://localhost:${PORT}/api/docs/`);
});
