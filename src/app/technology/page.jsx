"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function TechnologyPage() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch("/api/tech")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch content");
        return res.text();
      })
      .then((html) => {
        setContent(html);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 bg-clip-text text-transparent mb-8">
        Technology Blogs
      </h1>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : error ? (
        <Alert
          variant="destructive"
          className="bg-red-500/10 backdrop-blur-xl border-red-500/20 shadow-[0_4px_16px_0_rgba(239,68,68,0.1)]"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div
          className="prose prose-slate dark:prose-invert max-w-none prose-pre:!bg-slate-900 prose-pre:!text-slate-100 prose-pre:rounded-lg prose-pre:p-4 prose-code:before:hidden prose-code:after:hidden prose-code:font-mono prose-code:bg-slate-100 prose-code:dark:bg-slate-800 prose-code:px-1.5 prose-code:py-1 prose-code:rounded-md prose-a:text-blue-600 prose-a:underline prose-a:font-semibold prose-a:transition-colors hover:prose-a:text-blue-800 focus:prose-a:ring-2 focus:prose-a:ring-blue-400"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
