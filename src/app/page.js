"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTypewriter, Cursor } from "react-simple-typewriter";

export default function Home() {
  const [featureText] = useTypewriter({
    words: ["Videos", "Articles", "Books", "Personalized Guidance"],
    loop: 0,
    onLoopDone: () => console.log(`loop completed after 3 runs.`),
  });

  return (
    <>
      <h1 className="text-5xl font-serif font-extrabold justify-center text-center mt-2 mb-4 text-emerald-50">
        Let's Find your Study Materials
      </h1>
      <h1 className="text-4xl font-serif font-extrabold justify-center text-center mb-12 text-slate-50">
        from the Whole Internet
      </h1>

      <div className="flex flex-row text-3xl justify-center text-center mb-20 mx-auto">
        <span className="font-mono font-light text-slate-400">
          {featureText}
        </span>
        <Cursor cursorColor="#314158" />
      </div>

      <div className="grid max-w-3xl grid-cols-1 gap-3 mx-auto">
        <Textarea placeholder="Type your prompt here..." className="min-h-24" />
        <Button className="cursor-pointer text-lg">Proceed</Button>
      </div>
    </>
  );
}
