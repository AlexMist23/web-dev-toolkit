import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolList } from "@/components/tool-list";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  return (
    <div className="hidden lg:flex lg:flex-col w-64 border-r bg-background">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Dev Toolbox
          </h2>
        </div>
        <Separator />
        <ScrollArea className="h-[calc(100vh-8rem)] px-2">
          <div className="space-y-1 p-2">
            <Link
              href="/"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Home
            </Link>
            <Separator className="my-2" />
            <ToolList />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
