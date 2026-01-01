import { NextResponse } from 'next/server';
import { connectDB, Driver } from '@/lib/db';

// Utility to generate a unique driverId
function generateDriverId() {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DRV-${date}-${random}`;
}

// GET all drivers
export async function GET() {
  try {
    await connectDB();
    const drivers = await Driver.find();
    return NextResponse.json(drivers);
  } catch (err) {
    console.error("GET /api/driver error:", err);
    return NextResponse.json({ error: "Failed to fetch drivers" }, { status: 500 });
  }
}

// POST - Add a new driver
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Map frontend keys to expected model fields
    const fullName = data.fullName || data.name;
    const phoneNumber = data.phoneNumber || data.phone;
    const licenseNumber = data.licenseNumber || data.licenseNo;
    const licenseExpiry = data.licenseExpiry;
    const aadharNumber = data.aadharNumber || data.aadharNo;
    const aadharImage = data.aadharImage;
    const licenseImage = data.licenseImage;
    const address = data.address;
    const profilePhoto = data.profilePhoto;
    const availabilityStatus = data.availabilityStatus || 'free';

    // Validate required fields
    if (
      !fullName ||
      !phoneNumber ||
      !licenseNumber ||
      !licenseExpiry ||
      !aadharNumber ||
      !aadharImage ||
      !licenseImage ||
      !address
    ) {
      return NextResponse.json(
        { error: "Missing required driver fields." },
        { status: 400 }
      );
    }

    const driverId = generateDriverId();

    const newDriver = await Driver.create({
      driverId,
      fullName,
      phoneNumber,
      licenseNumber,
      licenseExpiry,
      aadharNumber,
      aadharImage,
      licenseImage,
      address,
      availabilityStatus,
      profilePhoto
    });

    return NextResponse.json({ message: "Driver added successfully", driver: newDriver });
  } catch (err: any) {
    console.error("POST /api/driver error:", err);
    const isDuplicate = err.code === 11000;
    return NextResponse.json(
      { error: isDuplicate ? "Duplicate field value (phone, license, aadhar, or driverId)" : "Failed to add driver" },
      { status: isDuplicate ? 409 : 500 }
    );
  }
}
