import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileImageIcon, ImageIcon, PaletteIcon } from "lucide-react";

const tools = [
  {
    title: "Image to WebP Converter",
    href: "/tools/webp-converter",
    icon: ImageIcon,
  },
  {
    title: "shadcn UI Theme Generator",
    href: "/tools/theme-generator",
    icon: PaletteIcon,
  },
  {
    title: "Open Graph Thumbnail Generator",
    href: "/tools/og-thumbnail-generator",
    icon: FileImageIcon,
  },
];

export function ToolList() {
  return (
    <div className="space-y-1">
      <h3 className="mb-2 px-3 text-sm font-semibold tracking-tight">Tools</h3>
      {tools.map((tool, index) => (
        <Button
          key={index}
          asChild
          variant="ghost"
          className="w-full justify-start"
        >
          <Link href={tool.href}>
            <tool.icon className="mr-2 h-4 w-4" />
            {tool.title}
          </Link>
        </Button>
      ))}
    </div>
  );
}
