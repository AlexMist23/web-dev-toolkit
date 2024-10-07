import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileImageIcon, ImageIcon, PaletteIcon } from "lucide-react";
import Logo from "@/components/icons/logo";

const tools = [
  {
    title: "Image to WebP Converter",
    description:
      "Convert your images to the WebP format for better performance.",
    href: "/tools/image-converter",
    icon: ImageIcon,
  },
  {
    title: "shadcn UI Theme Generator",
    description: "Customize the colors of your shadcn UI theme.",
    href: "/tools/shadcn-theme-gen",
    icon: PaletteIcon,
  },
  {
    title: "Open Graph Thumbnail Generator",
    description:
      "Create eye-catching thumbnails for your Open Graph meta tags.",
    href: "/tools/og-thumbnail-generator",
    icon: FileImageIcon,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center px-4">
      <Logo className="w-72 h-72 text-foreground/90" />
      <h1 className="text-4xl font-bold mb-4">Welcome to Dev Toolkit</h1>
      <p className="text-xl mb-8 max-w-2xl text-muted-foreground">
        Your one-stop solution for essential developer tools. Boost your
        productivity with my collection of utilities designed to streamline your
        workflow.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-6xl w-full">
        {tools.map((tool, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <tool.icon className="w-8 h-8 mb-2" />
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full">
                <Link href={tool.href}>Try it out</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
