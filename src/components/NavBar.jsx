"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavBar() {
  const { data: session } = useSession()

  console.log(session);

  const [nameValue, setNameValue] = useState("Guest");
  const [resultsCount, setResultsCount] = useState(0);

  useEffect(() => {
    let isSubscribed = true;

    async function manageUser() {
      if (!session?.user?.email) {
        // Reset to default state when no session
        setNameValue("Guest");
        setResultsCount(0);
        return;
      }

      try {
        console.log("Fetching user info for:", session.user.email);

        // Try to get existing user
        const response = await axios.get(`/api/users/info?email=${encodeURIComponent(session.user.email)}`);
        console.log("User info response:", response.data);

        if (!isSubscribed) return;

        if (response.data?.user) {
          // User exists, update local state
          setNameValue(response.data.user.name);
          setResultsCount(response.data.user.resultsCount || 0);
        }
      } catch (error) {
        if (!isSubscribed) return;

        console.log("Error response:", error.response);

        if (error.response?.status === 404) {
          // User not found, try to register
          try {
            console.log("Registering new user");
            const registerResponse = await axios.post("/api/users/register", {
              email: session.user.email,
              name: session.user.name,
              avatar: session.user.image
            });

            if (!isSubscribed) return;

            console.log("Register response:", registerResponse.data);

            if (registerResponse.data?.user) {
              setNameValue(registerResponse.data.user.name);
              setResultsCount(0);
            }
          } catch (registerError) {
            console.error("Error registering user:", registerError);
            if (registerError.response) {
              console.error("Register error response:", registerError.response.data);
            }
          }
        } else {
          console.error("Error fetching user:", error);
          if (error.response) {
            console.error("Error response:", error.response.data);
          }
        }
      }
    }

    manageUser();

    return () => {
      isSubscribed = false;
    };

  }, [session?.user?.email]);


  return (
    <>
      <div className="navbar sticky top-0 justify-center items-center backdrop-blur-lg shadow-lg rounded p-auto mx-auto px-10 sm:px-50 bg-[rgba(49,65,88,0.3)]">
        {session && (
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
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h7"
                    />{" "}
                  </svg>
                  <span className="badge badge-sm badge-primary indicator-item bg-accent">
                    {resultsCount}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent className="gap-3 flex flex-col">
                <SheetHeader className="mt-6 mb-4 ml-3 ">
                  <SheetTitle>Study Plans</SheetTitle>
                  <SheetDescription>
                    {resultsCount} Study Plans Found
                  </SheetDescription>
                </SheetHeader>
                <ul>
                  <li>Hello World</li>
                  <li>Hello World</li>
                  <li>Hello World</li>
                  <li>Hello World</li>
                  <li>Hello World</li>
                </ul>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit" variant="default">
                      Create New Study Plan
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

          </div>
        )}

        <div className="navbar-center">
          <Link href="/" className="cursor-pointer">
            <span className="text-slate-100 text-2xl font-extrabold font-serif">
              An-Nur
            </span>
            <span className="text-slate-600 text-2xl">{" / "}</span>
            <span className="text-slate-400 text-xl font-light font-sans">{nameValue}</span>
          </Link>
        </div>

        <div className="navbar-end">
          {!session && (
            <Button
              variant="outline"
              className="font-semibold text-md"
              onClick={() => signIn("google")}
            >
              Sign in
            </Button>
          )}
          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={`${session.user.name}'s profile`}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Button
                    variant="destructive"
                    className="w-full mx-auto"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </>
  );
}
