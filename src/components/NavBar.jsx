"use client";

import { useSession } from "next-auth/react";
import { memo } from "react";
import { useUserData } from "@/hooks/use-user-data";
import { StudyPlansSheet } from "@/components/nav/study-plans-sheet";
import { Brand } from "@/components/nav/brand";
import { UserMenu } from "@/components/nav/user-menu";

const NavBar = memo(function NavBar() {
  const { data: session } = useSession();
  const { name, resultsCount } = useUserData(session);

  return (
    <>
      <div className="navbar sticky top-0 justify-center items-center backdrop-blur-lg shadow-lg rounded p-auto mx-auto px-10 sm:px-50 bg-[rgba(49,65,88,0.3)]">
        {session && (
          <div className="navbar-start">
            <StudyPlansSheet resultsCount={resultsCount} />
          </div>
        )}

        <div className="navbar-center">
          <Brand nameValue={name} />
        </div>

        <div className="navbar-end">
          <UserMenu session={session} />
        </div>
      </div>
    </>
  );
});

export { NavBar };
