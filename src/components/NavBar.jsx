"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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

export default function NavBar() {
  return (
    <div className="navbar sticky top-0 backdrop-blur-lg shadow-lg rounded p-auto mx-auto px-10 sm:px-50 bg-[rgba(49,65,88,0.3)]">
      <div className="navbar-start">
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
            </Button>
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-xl font-bold text-center">Menu</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground text-center">
                Select a section to explore
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col space-y-4 mt-6">
              {[
                { name: "Survey", path: "/survey" },
                { name: "Health", path: "/health" },
                { name: "Science", path: "/science" },
                { name: "Technology", path: "/technology" },
                { name: "Physics", path: "/physics" },
                { name: "Chemistry", path: "/chemistry" },
                { name: "Mathematics", path: "/mathematics" },
                { name: "Research News", path: "/research-news" },
                { name: "Play a Quiz", path: "/quiz" },
              ].map((item) => (
                <SheetClose asChild key={item.name}>
                  <Link
                    href={item.path}
                    className="text-lg font-medium hover:underline text-foreground"
                  >
                    {item.name}
                  </Link>
                </SheetClose>
              ))}
            </div>

            <SheetFooter className="mt-6">
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="navbar-center">
        <Link
          href="/"
          className="text-2xl cursor-pointer font-extrabold font-serif text-emerald-50"
        >
          An-Nur
        </Link>
      </div>

      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
      </div>
    </div>
  );
}
