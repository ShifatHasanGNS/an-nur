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
  const { userData, error } = useUserData(session);
  const { name, resultsCount } = userData;
  const { setSelectedPlan } = useContext(PlanSelectionContext);

  return (
    <div className="navbar sticky top-0 justify-between items-center backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-lg p-auto mx-auto px-6 sm:px-50 bg-slate-900/20 border border-slate-800/30 hover:bg-slate-900/30 transition-all duration-300">
      <div className="flex items-center gap-4">
        {session && (
          <StudyPlansSheet
            resultsCount={resultsCount}
            onSelectPlan={setSelectedPlan}
          />
        )}
        {!session && <Brand nameValue={name} />}
      </div>

      {session && (
        <div className="flex-1 flex justify-center">
          <Brand nameValue={name} />
        </div>
      )}

      <div className="flex items-center">
        <UserMenu session={session} />
      </div>
    </div>
  );
});

export { NavBar };
