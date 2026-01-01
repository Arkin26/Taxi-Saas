import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Cab from '@/models/Cab';

export async function GET() {
  try {
    await connectDB();
    const cabs = await Cab.find().populate('driver'); // Populate driver info if needed
    return NextResponse.json(cabs);
  } catch (err) {
    console.error("GET /api/cabs error:", err);
    return NextResponse.json({ error: "Failed to fetch cabs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const {
      cabId,
      licensePlate,
      model,
      brand,
      capacity,
      driver,
      notes,
      status,
      fuelType
    } = data;

    // Validate required fields
    if (!cabId || !licensePlate || !model || !brand || !capacity || !fuelType) {
      return NextResponse.json(
        { error: "cabId, licensePlate, model, brand, capacity, and fuelType are required." },
        { status: 400 }
      );
    }

    const newCab = await Cab.create({
      cabId,
      licensePlate,
      model,
      brand,
      capacity,
      driver, // optional
      notes,  // optional
      status, // optional
      fuelType,
    });

    return NextResponse.json({ message: "Cab added successfully", cab: newCab });
  } catch (err: any) {
    console.error("POST /api/cabs error:", err);
    
    // Handle duplicate key errors specifically
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      return NextResponse.json(
        { error: `A cab with ${field}: "${value}" already exists.` },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: "Failed to add cab" }, { status: 500 });
  }
}