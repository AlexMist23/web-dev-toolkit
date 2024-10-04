"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const imageFormats = ["webp", "jpg", "jpeg", "png", "avif", "ico"];

export default function ImageConverterPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>("webp");
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type.startsWith("image/")) {
        setImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file",
          description: "Please upload an image file.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const convertImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("format", selectedFormat);

    try {
      // TODO: send formData to server
      // const response = await fetch('/api/convert-image', { method: 'POST', body: formData })
      // const data = await response.json()
      // setConvertedImage(data.convertedImageUrl)

      setConvertedImage(preview);
      toast({
        title: "Conversion complete",
        description: `Image converted to ${selectedFormat.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "An error occurred during conversion.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Image Converter</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Drag and drop an image or click to select
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                isDragActive ? "border-primary" : "border-muted-foreground"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the image here ...</p>
              ) : (
                <p>
                  Drag &apos;n&apos; drop an image here, or click to select an
                  image
                </p>
              )}
            </div>
            {preview && (
              <div className="mt-4">
                <Image
                  src={preview}
                  alt="Preview"
                  width={300}
                  height={300}
                  className="mx-auto"
                />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Convert Image</CardTitle>
            <CardDescription>
              Choose a format and convert your image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="format-select">Select Format</Label>
                <Select
                  onValueChange={setSelectedFormat}
                  value={selectedFormat}
                >
                  <SelectTrigger id="format-select">
                    <SelectValue placeholder="Select a format" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageFormats.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={convertImage} disabled={!image}>
                Convert Image
              </Button>
              {convertedImage && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Converted Image
                  </h3>
                  <Image
                    src={convertedImage}
                    alt="Converted"
                    width={300}
                    height={300}
                    className="mx-auto"
                  />
                  <Button
                    className="mt-2"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = convertedImage;
                      link.download = `converted.${selectedFormat}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download Converted Image
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
