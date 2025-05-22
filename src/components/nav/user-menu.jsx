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
        className="font-semibold text-md bg-slate-800/40 hover:bg-slate-700/40 border-slate-700/50 text-slate-200 hover:text-white transition-all duration-300"
        onClick={() => signIn("google")}
      >
        Sign in
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-full transition-all duration-300">
        {session?.user?.image ? (
          <Avatar className="border-2 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
            <AvatarImage src={session.user.image} />
            <AvatarFallback className="bg-slate-800/40 text-slate-200">{`${session.user.name}'s Profile`}</AvatarFallback>
          </Avatar>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 text-slate-200 hover:text-white transition-colors duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <DropdownMenuLabel className="text-center my-3 text-slate-200 font-semibold">
          Topics
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="border-slate-700/50 mb-3" />

        <ScrollArea className="flex-1 w-full max-h-[24vh] px-2 py-2 overflow-y-auto">
          {topics.map((topic, index) => (
            <DropdownMenuItem key={index} asChild>
              <Link
                href={`/${topic}`}
                className="w-full text-center cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800/50 py-2 px-3 rounded-lg transition-all duration-300 hover:shadow-[0_4px_16px_0_rgba(31,38,135,0.1)]"
                onClick={handleNavigation(`/${topic}`)}
                prefetch={true}
              >
                {toTitleCase(topic)}
              </Link>
            </DropdownMenuItem>
          ))}
        </ScrollArea>

        <DropdownMenuSeparator className="border-slate-700/50 mt-4 mb-3" />

        <DropdownMenuLabel className="my-2 text-center text-slate-400/80 text-sm">
          {session.user.email}
        </DropdownMenuLabel>

        <DropdownMenuItem className="my-2 text-center">
          <Button
            variant="destructive"
            className="w-full mx-auto bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white font-semibold shadow-lg hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300"
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
