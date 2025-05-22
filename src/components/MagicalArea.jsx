"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getFinalPrompt } from "@/constants/finalPrompt";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  BookOpen,
  Youtube,
  FileText,
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

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

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
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    if (selectedPlan) {
      setPrompt(selectedPlan.prompt || "");
      setTitle(selectedPlan.title || "");
      setResult(selectedPlan.result || "");
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    setSpeechSynthesis(synth);

    // Load voices
    const loadVoices = () => {
      const voices = synth.getVoices();
      setAvailableVoices(voices);
    };

    // Chrome loads voices asynchronously
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
    loadVoices();

    // Cleanup
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

  async function generateContent(prompt) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const response = await model.generateContent(prompt);
      if (!response?.response) throw new Error("No response received from AI");
      const text = response.response.text().trim();
      if (!text) throw new Error("Empty response received from AI");
      return text;
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw new Error(
        error.message || "Failed to generate study materials. Please try again."
      );
    }
  }

  async function handlePromptSubmit() {
    if (!prompt.trim()) {
      setError("Please enter what you'd like to learn about");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title for your study plan");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult("");
    try {
      // Add the selected level to the prompt
      const fullPrompt = getFinalPrompt(prompt, level);

      const aiResult = await generateContent(fullPrompt);
      if (session?.user?.email) {
        try {
          await axios.post("/api/users/add-result", {
            email: session.user.email.toLowerCase(),
            title: title.trim(),
            prompt: prompt.trim(),
            result: aiResult,
          });
          // Trigger StudyPlansSheet to refresh
          window.dispatchEvent(new Event("refresh-study-plans"));
        } catch (saveError) {
          console.error("Failed to save results:", saveError);
          if (saveError.response) {
            setError(
              saveError.response.data?.error || "Failed to save results."
            );
          }
        }
      }
      setResult(aiResult);
      setPrompt("");
      setTitle("");
    } catch (error) {
      setError(
        error.message || "Failed to generate study materials. Please try again."
      );
      setResult("");
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

  const getBestVoice = () => {
    if (!availableVoices.length) return null;

    // Priority order for voice selection
    const voicePriorities = [
      { name: "Google", lang: "en-US" },
      { name: "Microsoft", lang: "en-US" },
      { name: "Samantha", lang: "en-US" },
      { name: "Daniel", lang: "en-GB" },
      { name: "Karen", lang: "en-AU" },
      { name: "Moira", lang: "en-IE" },
      { name: "Tessa", lang: "en-ZA" },
      { name: "Veena", lang: "en-IN" },
    ];

    // Try to find a voice matching our priorities
    for (const priority of voicePriorities) {
      const voice = availableVoices.find(
        (v) => v.name.includes(priority.name) && v.lang.includes(priority.lang)
      );
      if (voice) return voice;
    }

    // Fallback to any English voice
    return (
      availableVoices.find((v) => v.lang.includes("en")) || availableVoices[0]
    );
  };

  const handleListen = () => {
    if (!speechSynthesis) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(result);

    // Get the best available voice
    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Optimize speech parameters for natural-sounding speech
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0; // Natural pitch
    utterance.volume = 1.0; // Full volume

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

  // Get appropriate icon based on item index
  const getIcon = (index) => {
    switch (index) {
      case 0:
        return <BookOpen className="h-5 w-5" />;
      case 1:
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 2:
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 3:
        return <BookOpen className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  // Get difficulty badge variant and style
  const getDifficultyBadge = (details) => {
    const text = details.toLowerCase();
    if (text.includes("beginner")) {
      return {
        variant: "outline",
        className: "border-green-500 text-green-600 bg-green-50",
      };
    }
    if (text.includes("intermediate")) {
      return {
        variant: "outline",
        className: "border-yellow-500 text-yellow-600 bg-yellow-50",
      };
    }
    if (text.includes("advanced")) {
      return {
        variant: "outline",
        className: "border-red-500 text-red-600 bg-red-50",
      };
    }
    return { variant: "secondary", className: "" };
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl">
      <div className="flex flex-col justify-center items-center gap-4 mx-auto w-full max-w-3xl">
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
          placeholder="Enter a title for your study plan (e.g. 'Quantum Physics Basics')"
          className="mb-2 px-4 py-3 rounded-xl border border-input bg-background/70 dark:bg-background/40 text-base sm:text-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        <Textarea
          placeholder="What would you like to learn about? (e.g., 'quantum physics for beginners', 'advanced calculus', 'machine learning basics')"
          className="min-h-28 text-base sm:text-lg px-4 py-3 rounded-xl border border-input bg-background/70 dark:bg-background/40 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
        <div className="w-full mb-2">
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger
              className="w-full px-4 py-3 rounded-xl border border-input bg-background/70 dark:bg-background/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base sm:text-lg"
              disabled={isLoading}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[60vh]">
              <SelectItem value="Just Curious">
                Just Curious - basic awareness, fun facts, casual interest
              </SelectItem>
              <SelectItem value="Conversation Level">
                Conversation Level - enough to discuss the topic socially
              </SelectItem>
              <SelectItem value="Personal Interest/Hobby">
                Personal Interest/Hobby - deeper exploration for personal
                enjoyment
              </SelectItem>
              <SelectItem value="Practical Application">
                Practical Application - how-to knowledge for real-world use
              </SelectItem>
              <SelectItem value="School/Student Level">
                School/Student Level - structured learning for educational
                purposes
              </SelectItem>
              <SelectItem value="Exam Preparation">
                Exam Preparation - focused study material for tests and
                assessments
              </SelectItem>
              <SelectItem value="Professional/Work Related">
                Professional/Work Related - job-relevant knowledge and skills
              </SelectItem>
              <SelectItem value="Specialized/Technical">
                Specialized/Technical - industry-specific or advanced technical
                content
              </SelectItem>
              <SelectItem value="Expert/Consultant Level">
                Expert/Consultant Level - comprehensive mastery for advising
                others
              </SelectItem>
              <SelectItem value="Research/Academic">
                Research/Academic - scholarly depth with citations and
                methodology
              </SelectItem>
              <SelectItem value="PhD/Dissertation Level">
                PhD/Dissertation Level - cutting-edge, original research-grade
                knowledge
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row items-center gap-2 w-full">
          <Button
            className="w-full text-base sm:text-lg h-12 rounded-xl bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white font-semibold shadow-lg hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePromptSubmit}
            disabled={isLoading || !prompt.trim() || !title.trim()}
          >
            {isLoading
              ? "Generating Study Materials..."
              : "Find Study Materials"}
          </Button>
        </div>
        {error && (
          <Alert
            variant="destructive"
            className="w-full bg-red-500/10 backdrop-blur-xl border-red-500/20 shadow-[0_4px_16px_0_rgba(239,68,68,0.1)]"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
      {isLoading && (
        <Card className="flex flex-col glass-card shadow-2xl w-full max-w-4xl mx-auto">
          <CardHeader>
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="flex-1">
            <Skeleton className="h-24 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      )}
      {!isLoading && result && (
        <Card className="flex flex-col glass-card shadow-2xl animate-fade-in relative group max-h-[80vh] w-full max-w-4xl mx-auto">
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-slate-800/40 hover:text-slate-200 transition-all duration-300"
              onClick={handleListen}
              disabled={!result}
            >
              {isSpeaking ? (
                <VolumeX className="h-4 w-4 text-red-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-slate-300 group-hover:text-slate-100" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-slate-800/40 hover:text-slate-200 transition-all duration-300"
              onClick={handleCopy}
              disabled={!result}
            >
              {copySuccess ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4 text-slate-300 group-hover:text-slate-100" />
              )}
            </Button>
          </div>
          <CardHeader className="flex-none">
            <CardTitle className="text-lg sm:text-xl line-clamp-2">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base prose-pre:!bg-slate-900 prose-pre:!text-slate-100 prose-pre:rounded-lg prose-pre:p-4 prose-code:before:hidden prose-code:after:hidden prose-code:font-mono prose-code:bg-slate-100 prose-code:dark:bg-slate-800 prose-code:px-1.5 prose-code:py-1 prose-code:rounded-md prose-a:text-blue-600 prose-a:underline prose-a:font-semibold prose-a:transition-colors hover:prose-a:text-blue-800 focus:prose-a:ring-2 focus:prose-a:ring-blue-400">
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
