"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ImageIcon, ImagesIcon, Menu } from "lucide-react";
import Logo from "./icons/logo";

const tools = [
  { name: "Image Converter", href: "/tools/image-converter", icon: ImageIcon },
  {
    name: "Open Graph Generator",
    href: "/tools/open-graph-gen",
    icon: ImagesIcon,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-40 lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <SidebarContent pathname={pathname} setIsOpen={setIsOpen} />
        </SheetContent>
      </Sheet>
      <aside className="hidden lg:block  inset-y-0 left-0 z-30 w-[240px] border-r bg-background">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}

function SidebarContent({
  pathname,
  setIsOpen,
}: {
  pathname: string;
  setIsOpen?: (open: boolean) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={() => setIsOpen?.(false)}
        >
          <Logo className="h-8 w-8 mr-2" />
          <span className="font-bold">Web Dev Toolkit</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {tools.map((tool) => (
            <Button
              key={tool.name}
              asChild
              variant={pathname === tool.href ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setIsOpen?.(false)}
            >
              <Link href={tool.href}>
                <tool.icon className="mr-2 h-4 w-4" />
                {tool.name}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
