"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, RefreshCw } from "lucide-react";
import Image from "next/image";

interface DroppedImage {
  file: File;
  preview: string;
}

const SIZES = [16, 32, 48, 64, 128];

export default function IcoGenerator() {
  const [image, setImage] = useState<DroppedImage | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>(SIZES);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImage({
        file: acceptedFiles[0],
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: false,
  });

  const handleSizeToggle = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size].sort((a, b) => a - b)
    );
  };

  const handleConvert = async () => {
    if (!image) return;

    setIsConverting(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("image", image.file);
    formData.append("sizes", JSON.stringify(selectedSizes));

    try {
      const response = await fetch("/api/tools/img-to-ico", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Conversion failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "favicon.ico";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Conversion successful",
        description: "Your ICO file has been generated and downloaded.",
      });
    } catch (error) {
      console.error("Error during conversion:", error);
      toast({
        title: "Conversion failed",
        description: "An error occurred during the ICO generation process.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      setProgress(100);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ICO Generator</h1>
      <Card className="mb-4">
        <CardContent className="p-4">
          <p className="mb-2">Preferable image ratio: 1:1 (square)</p>
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <input {...getInputProps()} />
            <p>
              {isDragActive
                ? "Drop the image here ..."
                : "Drag 'n' drop an image here, or click to select"}
            </p>
            <Upload className="mx-auto mt-4" />
          </div>
          {image && (
            <div className="flex justify-center mb-4">
              <Image
                src={image.preview}
                alt="Preview"
                width={128}
                height={128}
                className="rounded-md"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-4 mb-4">
            {SIZES.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={() => handleSizeToggle(size)}
                />
                <label htmlFor={`size-${size}`}>
                  {size}x{size}
                </label>
              </div>
            ))}
          </div>
          <Button
            onClick={handleConvert}
            disabled={!image || isConverting || selectedSizes.length === 0}
            className="w-full"
          >
            {isConverting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate and Download ICO
              </>
            )}
          </Button>
          {isConverting && <Progress value={progress} className="mt-2" />}
        </CardContent>
      </Card>
    </div>
  );
}
