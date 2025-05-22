"use client";

import { useSession } from "next-auth/react";
import { memo } from "react";
import { useUserData } from "@/hooks/use-user-data";
import { StudyPlansSheet } from "@/components/nav/study-plans-sheet";
import { Brand } from "@/components/nav/brand";
import { UserMenu } from "@/components/nav/user-menu";
import { PlanSelectionContext } from "@/components/nav/plan-selection-context";
import { useContext } from "react";

const NavBar = memo(function NavBar() {
  const { data: session } = useSession();
  const { name, resultsCount } = useUserData(session);
  const { setSelectedPlan } = useContext(PlanSelectionContext);

  return (
    <>
      <div className="navbar sticky top-0 justify-center items-center backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-lg p-auto mx-auto px-6 sm:px-50 bg-slate-900/20 border border-slate-800/30 hover:bg-slate-900/30 transition-all duration-300">
        {session && (
          <div className="navbar-start">
            <StudyPlansSheet
              resultsCount={resultsCount}
              onSelectPlan={setSelectedPlan}
            />
          </div>
        )}

        <div className="navbar-center ml-6 mr-6 sm:ml-16 sm:mr-16">
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
