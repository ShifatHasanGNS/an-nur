"use client";

import { useTypewriter, Cursor } from "react-simple-typewriter";

export default function TypeWriter() {
  const [featureText] = useTypewriter({
    words: ["Videos", "Articles", "Books", "Personalized Guidance"],
    loop: 0,
    onLoopDone: () => console.log(`loop completed after 3 runs.`),
  });

  return (
    <>
      <div className="flex flex-row text-3xl justify-center text-center mb-20 mx-auto">
        <span className="font-mono font-light text-slate-400">
          {featureText}
        </span>
        <Cursor cursorColor="#314158" />
      </div>
    </>
  );
}
