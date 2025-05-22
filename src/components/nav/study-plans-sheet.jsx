import { memo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const StudyPlansSheet = memo(function StudyPlansSheet({ resultsCount }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          <span className="badge badge-sm badge-primary indicator-item bg-accent">
            {resultsCount}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-3 flex flex-col bg-transparent backdrop-blur-md">
        <SheetHeader className="mt-6 ml-3">
          <SheetTitle>Study Plans</SheetTitle>
          <SheetDescription>{resultsCount} Study Plans Found</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 w-full h-[80vh] px-4 py-2 overflow-y-auto">
          <ul className="space-y-2">
            {Array(36)
              .fill(null)
              .map((_, index) => (
                <li
                  key={index}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
                >
                  Topic {index + 1}
                </li>
              ))}
          </ul>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" variant="default">
              Create New Study Plan
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
});

export { StudyPlansSheet };
