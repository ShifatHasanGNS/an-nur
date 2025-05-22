"use client";

import { createContext, useState } from "react";

export const PlanSelectionContext = createContext({
  selectedPlan: null,
  setSelectedPlan: () => {},
});

export function PlanSelectionProvider({ children }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  return (
    <PlanSelectionContext.Provider value={{ selectedPlan, setSelectedPlan }}>
      {children}
    </PlanSelectionContext.Provider>
  );
}
