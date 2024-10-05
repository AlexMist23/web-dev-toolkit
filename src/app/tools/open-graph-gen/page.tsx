"use client";

import { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import domtoimage from "dom-to-image";
import Image from "next/image";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

export default function ImageGenerator() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/webp": [".webp"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });

  const downloadImage = async (image: ImageFile, format: "png" | "webp") => {
    const cardRef = cardRefs.current[images.indexOf(image)];
    if (!cardRef) return;

    try {
      const blob = await domtoimage.toBlob(cardRef, { quality: 0.95 });

      if (format === "png") {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${image.file.name
          .split(".")
          .slice(0, -1)
          .join(".")}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast({
          title: "Image downloaded",
          description: `${image.file.name} has been downloaded as PNG.`,
        });
      } else {
        const formData = new FormData();
        formData.append("file", blob, image.file.name);

        const response = await fetch("/api/image/converter", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const webpBlob = await response.blob();
          const url = URL.createObjectURL(webpBlob);
          const link = document.createElement("a");
          link.download = `${image.file.name
            .split(".")
            .slice(0, -1)
            .join(".")}.webp`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          toast({
            title: "Image downloaded",
            description: `${image.file.name} has been downloaded as WebP.`,
          });
        } else {
          throw new Error("Failed to convert image to WebP");
        }
      }
    } catch (error) {
      console.error("Error generating or converting image:", error);
      toast({
        title: "Error",
        description: "Failed to generate or convert the image.",
        variant: "destructive",
      });
    }
  };

  const removeImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Open Graph Generator</h1>
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <input {...getInputProps()} />
        <p>
          {isDragActive
            ? "Drop the images here ..."
            : "Drag 'n' drop images here, or click to select"}
        </p>
        <Upload className="mx-auto mt-4" />
      </div>
      {images.map((image, index) => (
        <div key={image.id} className="flex flex-col items-center mb-8">
          <Card>
            <div className="flex p-2 items-center">
              <CardTitle className="">{image.file.name}</CardTitle>
              <Button
                variant="destructive"
                size="icon"
                className="ml-auto"
                onClick={() => removeImage(image.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Card
              ref={(el: HTMLDivElement | null) => {
                cardRefs.current[index] = el;
              }}
              className="relative border-[40px] w-[1200px] h-[630px] bg-muted border-muted"
            >
              <Card className="w-full h-full overflow-hidden">
                <Image
                  src={image.preview}
                  alt={`Uploaded ${image.file.name}`}
                  fill
                  className="rounded-md shadow-xl object"
                />
              </Card>
            </Card>
          </Card>
          <div className="flex gap-4 mt-4">
            <Button onClick={() => downloadImage(image, "png")}>
              <Download className="mr-2 h-4 w-4" /> Download PNG
            </Button>
            <Button onClick={() => downloadImage(image, "webp")}>
              <Download className="mr-2 h-4 w-4" /> Download WebP
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
