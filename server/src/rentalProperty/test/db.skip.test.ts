import { testApartment } from "@/rentalProperty/test/mock";
import { RentalPropertySchema } from "../models/rentalProperty.schema";
import { CAMPUS } from "@/rentalProperty/lib/const";
import { createConnection } from "mongoose";
import { DB_URL } from "@/lib/const";

async function send_db() {
  const DB_KEY = CAMPUS["GUADALAJARA"];
  const db = await createConnection(DB_URL).asPromise();
  console.log("connection to db success");
  const Model = db.model(DB_KEY, RentalPropertySchema, DB_KEY);
  const new_val = await Model.create(testApartment);
  console.log("value saved id: " + new_val._id);
  db.close();
  return;
}
send_db();
