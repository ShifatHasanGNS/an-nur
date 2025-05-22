import { memo, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";

const StudyPlansSheet = memo(function StudyPlansSheet({
  resultsCount,
  onSelectPlan = () => {},
}) {
  const { data: session } = useSession();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);
  const sheetRef = useRef();

  // Fetch user's study plans
  const fetchPlans = async () => {
    if (!session?.user?.email) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/users/info?email=${encodeURIComponent(session.user.email)}`
      );
      if (response.data?.user?.resultsHistory) {
        const reversed = response.data.user.resultsHistory.reverse();
        setPlans(reversed);
        // Highlight the most recent plan
        if (reversed.length > 0) setLastAddedId(reversed[0]._id || null);
      }
    } catch (error) {
      console.error("Failed to fetch study plans:", error);
      setError("Failed to load study plans");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    // Listen for refresh event
    function handleRefresh() {
      fetchPlans();
    }
    window.addEventListener("refresh-study-plans", handleRefresh);
    return () => {
      window.removeEventListener("refresh-study-plans", handleRefresh);
    };
    // eslint-disable-next-line
  }, [session?.user?.email, resultsCount]);

  // Optionally, listen for close-sheet event to close the sheet
  useEffect(() => {
    function handleCloseSheet() {
      if (sheetRef.current) {
        sheetRef.current.click();
      }
    }
    window.addEventListener("close-sheet", handleCloseSheet);
    return () => {
      window.removeEventListener("close-sheet", handleCloseSheet);
    };
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative" ref={sheetRef}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          <Badge
            variant="secondary"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-2 bg-primary text-primary-foreground"
          >
            {resultsCount}
          </Badge>
        </Button>
      </SheetTrigger>

      <SheetContent className="pb-6 w-full sm:max-w-sm flex flex-col gap-4 bg-slate-900/40 backdrop-blur-2xl border-slate-800/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <SheetHeader className="mt-6 px-4">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 bg-clip-text text-transparent">
            Study Plans
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2 text-slate-400/80 mt-1">
            <Clock className="h-4 w-4" />
            {resultsCount} Study Plans Created
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 w-full px-4">
          {isLoading ? (
            <div className="space-y-4 mt-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-lg bg-slate-800/20 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-slate-400/80">
              <p>{error}</p>
              <Button
                variant="ghost"
                className="mt-2 hover:bg-slate-800/40 text-slate-300"
                onClick={fetchPlans}
              >
                Try Again
              </Button>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8 text-slate-400/80">
              <p>No study plans yet</p>
              <p className="text-sm mt-2">Create your first study plan!</p>
            </div>
          ) : (
            <div className="space-y-3 py-4">
              {plans.map((plan, index) => (
                <div
                  key={plan._id || index}
                  className={cn(
                    "group relative p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_16px_0_rgba(31,38,135,0.1)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]",
                    lastAddedId === plan._id
                      ? "bg-slate-800/40 border-slate-600/50 animate-fade-in"
                      : "hover:bg-slate-800/30 border-slate-800/40"
                  )}
                  onClick={() => {
                    onSelectPlan(plan);
                    const closeEvent = new Event("close-sheet");
                    window.dispatchEvent(closeEvent);
                  }}
                >
                  <p className="font-medium line-clamp-1 text-slate-200/90">
                    {plan.title || plan.prompt || "Untitled Plan"}
                  </p>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4 text-slate-400/80" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
});

export { StudyPlansSheet };
