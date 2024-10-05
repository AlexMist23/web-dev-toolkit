"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ImageIcon,
  ImagesIcon,
  Moon,
  Sun,
  Menu,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

const tools = [
  { title: "Image Converter", href: "/tools/image-converter", icon: ImageIcon },
  { title: "Open Graph Gen", href: "/tools/open-graph-gen", icon: ImagesIcon },
];

export function Sidebar() {
  const [theme, setTheme] = useState("light");
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    // In a real app, you'd apply the theme change to the document here
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-nowrap">
          Dev Toolbox
        </Link>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        )}
      </div>
      <Separator />
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          <Button asChild variant="ghost" className="w-full justify-start">
            <a href="/">Home</a>
          </Button>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold tracking-tight">Tools</h3>
            {tools.map((tool, index) => (
              <Button
                key={index}
                asChild
                variant="ghost"
                className="w-full justify-start"
              >
                <a href={tool.href}>
                  <tool.icon className="mr-2 h-4 w-4" />
                  {!isCollapsed && tool.title}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleTheme()}>
              {theme === "light" ? "Dark" : "Light"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setSidebarWidth((prevWidth) => {
      const newWidth = prevWidth + e.movementX;
      return Math.max(200, Math.min(400, newWidth));
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  if (isMobile) {
    return (
      <>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div
      className="hidden lg:block border-r bg-background shadow-lg relative"
      style={{
        width: `${sidebarWidth}px`,
        minWidth: isCollapsed ? "80px" : "200px",
      }}
    >
      <SidebarContent />
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-ew-resize"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

export default Sidebar;
