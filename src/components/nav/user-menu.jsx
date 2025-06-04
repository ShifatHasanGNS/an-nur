import { memo } from "react";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const UserMenu = memo(function UserMenu({ session }) {
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
        <Avatar className="border-2 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
          <AvatarImage
            src={session.user.image}
            onError={(e) => {
              console.error("Avatar image failed to load:", e);
            }}
            alt={`${session.user.name}'s avatar`}
          />
          <AvatarFallback className="bg-slate-800/40 text-slate-200">
            {session.user.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
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
