export const {
  PORT = 3001,
  DB_URL,
  JWT_SECRET,
  RESEND_KEY,
  BASE_URL,
  FROM_EMAIL,
  API_DOCS_PATH = "api-docs/openapi.yml",
} = process.env;


import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { __dirname }; // NOTE: util in case
