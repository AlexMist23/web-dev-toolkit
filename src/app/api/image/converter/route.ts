import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const webpBuffer = await sharp(buffer).webp({ quality: 100 }).toBuffer();

    return new NextResponse(webpBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": `attachment; filename="${file.name.replace(
          /\.[^/.]+$/,
          ""
        )}.webp"`,
      },
    });
  } catch (error) {
    console.error("Error converting image:", error);
    return NextResponse.json(
      { error: "Error converting image" },
      { status: 500 }
    );
  }
}
