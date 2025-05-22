import { memo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const topics = [
  "chemistry",
  "health",
  "mathematics",
  "physics",
  "quiz",
  "research-news",
  "science",
  "survey",
  "technology",
];

function toTitleCase(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

const UserMenu = memo(function UserMenu({ session }) {
  const router = useRouter();

  const handleNavigation = useCallback(
    (path) => {
      return (e) => {
        e.preventDefault();
        router.push(path);
      };
    },
    [router]
  );

  if (!session) {
    return (
      <Button
        variant="outline"
        className="font-semibold text-md"
        onClick={() => signIn("google")}
      >
        Sign in
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {session?.user?.image ? (
          <Avatar>
            <AvatarImage src={session.user.image} />
            <AvatarFallback>{`${session.user.name}'s Profile`}</AvatarFallback>
          </Avatar>
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
      <DropdownMenuContent className="w-56 p-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-xl shadow-xl">
        <DropdownMenuLabel className="text-center my-3 text-slate-200 font-semibold">
          Topics
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="border-slate-700/50 mb-3" />

        <ScrollArea className="flex-1 w-full max-h-[24vh] px-2 py-2 overflow-y-auto">
          {topics.map((topic, index) => (
            <DropdownMenuItem key={index} asChild>
              <Link
                href={`/${topic}`}
                className="w-full text-center cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800/50 py-2 px-3 rounded-lg transition-all duration-200"
                onClick={handleNavigation(`/${topic}`)}
                prefetch={true}
              >
                {toTitleCase(topic)}
              </Link>
            </DropdownMenuItem>
          ))}
        </ScrollArea>

        <DropdownMenuSeparator className="border-slate-700/50 mt-4 mb-3" />

        <DropdownMenuLabel className="my-2 text-center text-slate-400 text-sm">
          {session.user.email}
        </DropdownMenuLabel>

        <DropdownMenuItem className="my-2 text-center">
          <Button
            variant="destructive"
            className="w-full mx-auto bg-gradient-to-r from-rose-800 via-rose-700 to-rose-800 text-white font-semibold shadow-lg hover:from-rose-700 hover:via-rose-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 transition-all duration-300"
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export { UserMenu };
