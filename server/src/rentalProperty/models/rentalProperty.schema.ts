import { model, Schema } from "mongoose";
import type { RentalProperty } from "../rentalProperty.validation";

const RentalPropertySchema = new Schema<
  RentalProperty & { propertyOwner: Schema.Types.ObjectId }
>(
  {
    propertyOwner: {
      type: Schema.Types.ObjectId,
      required: true,
      select: false,
    },
    name: { type: String, required: true },
    imgPrincipal: { type: String, required: true },
    description: { type: String, required: true },
    summary: { type: String, required: true },
    rateting: { type: Number, required: false, default: 5 },
    price: { type: Number, required: true },
    isPetFriendly: { type: Boolean, required: false, default: false },
    capacity: { type: Number, required: true },
    isFurnished: { type: Boolean, required: true },
    parkingNum: { type: Number, required: false, default: 0 },
    contractTime: { type: Number, required: true },
    type: { type: String, required: true },
    gender: { type: String, required: true },
    deposit: { type: Number, required: false, default: 0 },
    distance: { type: Number, required: true },
    bathroom: { type: String, required: true },
    isAvailable: { type: Boolean, required: false, default: true },
    amenities: { type: [String], required: false },
    rules: { type: [String], required: false },
    services: { type: [String], required: false },
  },
  { autoCreate: false }
);
export default (colection: string) => model(colection, RentalPropertySchema);
