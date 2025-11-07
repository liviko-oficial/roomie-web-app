import { beforeAll, afterAll } from "vitest";
import { connect, disconnect } from "mongoose";

// Configuración global para tests
beforeAll(async () => {
  const mongoUrl = process.env.TEST_DB_URL || "mongodb://localhost:27017/liviko_test";
  try {
    await connect(mongoUrl);
    console.log("Connected to test database");
  } catch (error) {
    console.error("Failed to connect to test database:", error);
    process.exit(1);
  }
});

afterAll(async () => {
  try {
    await disconnect();
    console.log("Disconnected from test database");
  } catch (error) {
    console.error("Failed to disconnect from test database:", error);
  }
});