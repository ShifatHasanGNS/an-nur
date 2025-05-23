"use client";

import { useContext } from "react";
import { TypeWriter } from "@/components/typewriter";
import { MagicalArea } from "@/components/MagicalArea";
import { PlanSelectionContext } from "@/components/nav/plan-selection-context";

export default function Home() {
  const { selectedPlan } = useContext(PlanSelectionContext);
  return (
    <div className="container mx-auto w-full sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-center bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent">
          Let's Find your Study Materials
        </h1>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-center bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent">
          from the Whole Internet
        </h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <TypeWriter />
      </div>

      <div className="mx-auto sm:max-w-[70vw]">
        <MagicalArea selectedPlan={selectedPlan} />
      </div>
    </div>
  );
}
