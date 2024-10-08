import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import pngToIco from "png-to-ico";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const sizesJson = formData.get("sizes") as string;
    const sizes = JSON.parse(sizesJson) as number[];

    if (!imageFile || !sizes || sizes.length === 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const imageBuffer = await imageFile.arrayBuffer();

    // Resize the input image to the desired sizes
    const resizedImages = await Promise.all(
      sizes.map((size) =>
        sharp(imageBuffer).resize(size, size).png().toBuffer()
      )
    );

    // Generate the ICO file using the resized PNGs
    const icoBuffer = await pngToIco(resizedImages);

    return new NextResponse(icoBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/x-icon",
        "Content-Disposition": 'attachment; filename="favicon.ico"',
      },
    });
  } catch (error) {
    console.error("Error during ICO generation:", error);
    return NextResponse.json(
      { error: "ICO generation failed" },
      { status: 500 }
    );
  }
}
