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
      <DropdownMenuContent className="mx-auto justify-center items-center gap-4 bg-transparent backdrop-blur-md">
        <DropdownMenuLabel className="text-center my-3">
          Topics
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="border-1 border-slate-600 mb-3" />

        <ScrollArea className="flex-1 w-full max-h-[24vh] px-2 py-2 overflow-y-auto">
          {topics.map((topic, index) => (
            <DropdownMenuItem key={index} asChild>
              <Link
                href={`/${topic}`}
                className="w-full text-center cursor-pointer hover:bg-accent hover:text-accent-foreground py-2 px-3 rounded-md transition-colors"
                onClick={handleNavigation(`/${topic}`)}
                prefetch={true}
              >
                {toTitleCase(topic)}
              </Link>
            </DropdownMenuItem>
          ))}
        </ScrollArea>

        <DropdownMenuSeparator className="border-1 border-rose-300 mt-8 mb-3" />

        <DropdownMenuLabel className="my-2 text-center">
          {session.user.email}
        </DropdownMenuLabel>

        <DropdownMenuItem className="my-2 text-center">
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
  );
});

export { UserMenu };
