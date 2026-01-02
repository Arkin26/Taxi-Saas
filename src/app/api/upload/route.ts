// // src/app/api/upload/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import cloudinary from '@/lib/cloudinary';

// export const runtime = 'nodejs'; // make sure we're not on the edge runtime

// // Helper to turn a File into a base64 data URI Cloudinary accepts
// async function fileToDataURI(file: File) {
//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);
//   return `data:${file.type};base64,${buffer.toString('base64')}`;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();

//     // If you only ever upload a single "file":
//     // const file = formData.get('file') as File | null;
//     // if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
//     // const dataUri = await fileToDataURI(file);
//     // const result = await cloudinary.uploader.upload(dataUri, { folder: 'drivers' });
//     // return NextResponse.json({ success: true, url: result.secure_url });

//     // If you want to support multiple named fields:
//     const fields = ['aadharImage', 'licenseImage', 'profilePhoto'] as const;
//     const urls: Record<string, string> = {};

//     for (const key of fields) {
//       const file = formData.get(key) as File | null;
//       if (!file) continue; // optional — skip if not provided

//       const dataUri = await fileToDataURI(file);
//       const uploaded = await cloudinary.uploader.upload(dataUri, {
//         folder: 'drivers',
//         resource_type: 'image',
//       });

//       urls[key] = uploaded.secure_url;
//     }

//     if (Object.keys(urls).length === 0) {
//       return NextResponse.json({ error: 'No files provided' }, { status: 400 });
//     }

//     return NextResponse.json({ success: true, urls });
//   } catch (error) {
//     console.error('Cloudinary Upload Error:', error);
//     return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
//   }
// }

// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs'; // REQUIRED for Buffer & Cloudinary

/**
 * Convert a File into a base64 Data URI (Cloudinary-compatible)
 */
async function fileToDataURI(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const fields = ['aadharImage', 'licenseImage', 'profilePhoto'] as const;
    const urls: Partial<Record<(typeof fields)[number], string>> = {};

    for (const field of fields) {
      const file = formData.get(field);

      if (!file || !(file instanceof File)) continue;

      const dataUri = await fileToDataURI(file);

      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'drivers',
        resource_type: 'image',
      });

      urls[field] = uploadResult.secure_url;
    }

    if (Object.keys(urls).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, urls },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
