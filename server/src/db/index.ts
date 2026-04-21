import { DB_URL } from "@/lib/const";
import mongoose from "mongoose";
export default async function connect() {
  try {
    const db = await mongoose.connect(DB_URL, {
      maxPoolSize: 50,
      minPoolSize: 5,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
    });
    db.connection.on("error", (e) => {
      console.error(e);
      throw Error("Connection to db fail");
    });
    console.log("Connection to db made");
  } catch (e) {
    console.error(e);
    throw Error("Connection to db fail");
  }
}
