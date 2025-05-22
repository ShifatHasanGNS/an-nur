"use client";

import { useContext } from "react";
import { TypeWriter } from "@/components/typewriter";
import { MagicalArea } from "@/components/MagicalArea";
import { PlanSelectionContext } from "@/components/nav/plan-selection-context";

export default function Home() {
  const { selectedPlan } = useContext(PlanSelectionContext);
  return (
    <>
      <h1 className="text-5xl font-serif font-extrabold justify-center text-center mt-2 mb-4 text-emerald-50">
        Let's Find your Study Materials
      </h1>
      <h1 className="text-4xl font-serif font-extrabold justify-center text-center mt-4 mb-12 text-slate-50">
        from the Whole Internet
      </h1>

      <TypeWriter />
      <div className="flex flex-row gap-4">
        <MagicalArea selectedPlan={selectedPlan} />
      </div>
    </>
  );
}
