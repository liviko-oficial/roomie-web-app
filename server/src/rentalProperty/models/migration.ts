import { DB_URL } from "../../lib/const";
import { CAMPUS } from "../lib/const";
import mongoose from "mongoose";
import Schema from "../models/rentalProperty.schema";
async function migation() {
  try {
    const db = await mongoose.createConnection(DB_URL).asPromise();
    console.log("Connetion to db finish");
    for (const key in CAMPUS) {
      await db.createCollection(CAMPUS[key]);
      console.log(`created:${CAMPUS[key]}`);
    }
    return;
  } catch (error) {
    console.error("Error conecting to db");
    console.log(error);
  }
}
migation();
