// scripts/insertCab.ts
import mongoose from "mongoose";
import Cab from "../models/Cab.ts";

const MONGO_URI = process.env.MONGO_URI || "your_mongodb_uri_here";

async function insertCab() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const cab = await Cab.create({
      cabId: "CAB001",
      licensePlate: "MH12AB3456",
      model: "Innova Crysta",
      brand: "Toyota",
      capacity: 6,
      notes: "AC, music system",
      fuelType: "diesel",
      status: "available",
    });

    console.log("Cab inserted:", cab);
    process.exit(0);
  } catch (error) {
    console.error("Error inserting cab:", error);
    process.exit(1);
  }
}

insertCab();
