"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

function MagicalArea({ selectedPlan }) {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [level, setLevel] = useState("Just Curious");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  const knowledgeLevels = [
    "Just Curious",
    "Conversation Level",
    "Personal Interest/Hobby",
    "Practical Application",
    "School/Student Level",
    "Exam Preparation",
    "Professional/Work Related",
    "Specialized/Technical",
    "Expert/Consultant Level",
    "Research/Academic",
    "PhD/Dissertation Level",
  ];

  useEffect(() => {
    if (selectedPlan) {
      setTitle(selectedPlan.title || "");
      setPrompt(selectedPlan.prompt || "");
      const newLevel = selectedPlan.level || "Just Curious";
      setLevel(newLevel);
      setResult(selectedPlan.result || "");
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    setSpeechSynthesis(synth);

    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, []);

  const handleReset = () => {
    setPrompt("");
    setTitle("");
    setResult("");
    setError(null);
    setLevel("Just Curious");
    setCopySuccess(false);
  };

  async function handlePromptSubmit() {
    if (!prompt.trim()) {
      setError("Please enter what you'd like to learn about");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title for your study item");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult("");

    if (!session?.user?.email) {
      setError("Please log in to generate and save study materials.");
      setIsLoading(false);
      return;
    }

    try {
      const dataToSend = {
        email: session.user.email.toLowerCase(),
        title: title.trim(),
        prompt: prompt.trim(),
        level: level,
      };

      const response = await axios.post(
        "/api/generate-study-material",
        dataToSend
      );

      setResult(response.data.result);

      window.dispatchEvent(new Event("refresh-history"));
    } catch (error) {
      console.error("Failed to generate and save results:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        setError(
          error.response.data?.error || "Failed to generate and save results."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleListen = () => {
    if (!speechSynthesis) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(result);

    const voices = speechSynthesis.getVoices();
    const googleVoice = voices.find(
      (v) => v.name.includes("Google") && v.lang.includes("en-US")
    );
    if (googleVoice) {
      utterance.voice = googleVoice;
      utterance.rate = 0.9; // Slightly slower for more natural speech
      utterance.pitch = 1.0; // Natural pitch
      utterance.volume = 1.0; // Full volume
    }

    // Add pauses for better readability
    utterance.text = result
      .replace(/\./g, ". ")
      .replace(/\!/g, "! ")
      .replace(/\?/g, "? ")
      .replace(/\n/g, ". ");

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Ensure clean state before speaking
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 space-y-4 w-full max-w-7xl">
      <div className="flex flex-col justify-center items-center gap-4 mx-auto w-full max-w-4xl">
        <div className="flex justify-end w-full">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
            onClick={handleReset}
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <input
          type="text"
          placeholder="Title (e.g. 'Quantum Physics')"
          className="w-[calc(100%-0.5rem)] sm:w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-input bg-background/70 dark:bg-background/40 text-sm sm:text-base lg:text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />

        <Textarea
          placeholder="What would you like to learn? (e.g. 'quantum physics', 'calculus', 'machine learning')"
          className="w-[calc(100%-0.5rem)] sm:w-full min-h-24 sm:min-h-28 text-sm sm:text-base lg:text-lg px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-input bg-background/70 dark:bg-background/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-y"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-[calc(100%-0.5rem)] sm:w-full mb-8 sm:mb-12">
          <div className="w-full sm:flex-1">
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger
                className="w-full h-10 sm:h-10 md:h-11 px-3 sm:px-4 rounded-xl border border-input bg-background/70 dark:bg-background/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm sm:text-base"
                disabled={isLoading}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[60vh] w-full">
                {knowledgeLevels.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="text-sm sm:text-base"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full sm:w-auto sm:flex-none px-4 sm:px-6 h-10 sm:h-10 md:h-11 rounded-xl bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white font-medium sm:font-semibold text-sm sm:text-base shadow-lg hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePromptSubmit}
            disabled={isLoading || !prompt.trim() || !title.trim()}
          >
            <span className="block sm:hidden">
              {isLoading ? "Generating..." : "Generate Study Materials"}
            </span>
            <span className="hidden sm:block">
              {isLoading
                ? "Generating Study Materials..."
                : "Find Study Materials"}
            </span>
          </Button>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="w-[calc(100%-0.5rem)] sm:w-full bg-red-500/10 backdrop-blur-xl border-red-500/20 shadow-[0_4px_16px_0_rgba(239,68,68,0.1)]"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {isLoading && (
        <Card className="flex flex-col glass-card shadow-2xl w-full max-w-5xl mx-auto">
          <CardHeader>
            <Skeleton className="h-5 sm:h-6 w-2/3 mb-2" />
            <Skeleton className="h-3 sm:h-4 w-1/3" />
          </CardHeader>
          <CardContent className="flex-1">
            <Skeleton className="h-20 sm:h-24 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-6 sm:h-8 w-20 sm:w-24" />
          </CardFooter>
        </Card>
      )}

      {!isLoading && result && (
        <Card className="flex flex-col glass-card shadow-2xl animate-fade-in relative group mx-auto">
          <CardHeader className="flex-none pr-16 sm:pr-20">
            <div className="w-full">
              <CardTitle className="text-base sm:text-lg md:text-xl break-words pr-2">
                {title}
              </CardTitle>
            </div>
          </CardHeader>

          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1.5 sm:gap-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-slate-800/40 hover:text-slate-200 transition-all duration-300"
              onClick={handleListen}
              disabled={!result}
            >
              {isSpeaking ? (
                <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-300 group-hover:text-slate-100" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-slate-800/40 hover:text-slate-200 transition-all duration-300"
              onClick={handleCopy}
              disabled={!result}
            >
              {copySuccess ? (
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-300 group-hover:text-slate-100" />
              )}
            </Button>
          </div>

          <CardContent className="px-3 sm:px-6 overflow-y-auto">
            <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm md:text-base prose-pre:!bg-slate-900 prose-pre:!text-slate-100 prose-pre:rounded-lg prose-pre:p-2 sm:prose-pre:p-4 prose-code:before:hidden prose-code:after:hidden prose-code:font-mono prose-code:bg-slate-100 prose-code:dark:bg-slate-800 prose-code:px-1 sm:prose-code:px-1.5 prose-code:py-0.5 sm:prose-code:py-1 prose-code:rounded-md prose-a:text-blue-600 prose-a:underline prose-a:font-semibold prose-a:transition-colors hover:prose-a:text-blue-800 focus:prose-a:ring-2 focus:prose-a:ring-blue-400 prose-headings:text-sm sm:prose-headings:text-base md:prose-headings:text-lg">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  a: (props) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-600 font-semibold transition-colors hover:text-blue-800 focus:ring-2 focus:ring-blue-400"
                    >
                      {props.children}
                    </a>
                  ),
                  pre: (props) => (
                    <div className="overflow-x-auto">
                      <pre {...props} />
                    </div>
                  ),
                  img: (props) => (
                    <img
                      {...props}
                      className="max-w-full h-auto rounded-lg"
                      loading="lazy"
                    />
                  ),
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export { MagicalArea };
