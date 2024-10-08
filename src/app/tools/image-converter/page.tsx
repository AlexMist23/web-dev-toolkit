"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, RefreshCw, Trash2 } from "lucide-react";
import Image from "next/image";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  convertedUrl?: string;
  isConverting: boolean;
  conversionProgress: number;
}

export default function ImageConverter() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      isConverting: false,
      conversionProgress: 0,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
  });

  const convertImage = async (image: ImageFile) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === image.id
          ? { ...img, isConverting: true, conversionProgress: 0 }
          : img
      )
    );

    const formData = new FormData();
    formData.append("file", image.file);

    try {
      const response = await fetch("/api/tools/img-converter", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const convertedUrl = URL.createObjectURL(blob);
        setImages((prevImages) =>
          prevImages.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  convertedUrl,
                  isConverting: false,
                  conversionProgress: 100,
                }
              : img
          )
        );
        toast({
          title: "Conversion successful",
          description: `${image.file.name} has been converted to WebP.`,
        });
      } else {
        throw new Error("Failed to convert image");
      }
    } catch (error) {
      console.error("Error converting image:", error);
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === image.id
            ? { ...img, isConverting: false, conversionProgress: 0 }
            : img
        )
      );
      toast({
        title: "Conversion failed",
        description: `Failed to convert ${image.file.name}.`,
        variant: "destructive",
      });
    }
  };

  const convertAllImages = async () => {
    for (const image of images) {
      if (!image.convertedUrl) {
        await convertImage(image);
      }
    }
  };

  const downloadImage = (image: ImageFile) => {
    if (image.convertedUrl) {
      const link = document.createElement("a");
      link.href = image.convertedUrl;
      link.download = `${image.file.name
        .split(".")
        .slice(0, -1)
        .join(".")}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAllImages = () => {
    images.forEach((image) => {
      if (image.convertedUrl) {
        downloadImage(image);
      }
    });
  };

  const removeImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Converter</h1>
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
      {images.length > 0 && (
        <div className="mb-4 flex justify-end space-x-2">
          <Button onClick={convertAllImages}>
            <RefreshCw className="mr-2 h-4 w-4" /> Convert All to WebP
          </Button>
          <Button onClick={downloadAllImages}>
            <Download className="mr-2 h-4 w-4" /> Download All
          </Button>
        </div>
      )}
      {images.map((image) => (
        <Card key={image.id} className="mb-4">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Image
                src={image.preview}
                alt={image.file.name}
                width={64}
                height={64}
                objectFit="cover"
                className="rounded"
              />
              <div>
                <p className="font-semibold">{image.file.name}</p>
                <p className="text-sm text-gray-500">
                  {(image.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {image.isConverting ? (
                <Progress value={image.conversionProgress} className="w-24" />
              ) : (
                <>
                  <Button
                    onClick={() => convertImage(image)}
                    disabled={!!image.convertedUrl}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Convert
                  </Button>
                  <Button
                    onClick={() => downloadImage(image)}
                    disabled={!image.convertedUrl}
                  >
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
