"use client";

import { useTypewriter, Cursor } from "react-simple-typewriter";

function TypeWriter() {
  const [featureText] = useTypewriter({
    words: ["Videos", "Articles", "Books", "Personalized Guidance"],
    loop: 0,
    onLoopDone: () => console.log(`loop completed after 3 runs.`),
  });

  return (
    <>
      <div className="flex flex-row text-3xl justify-center text-center mx-auto">
        <span className="font-mono font-light text-slate-400">
          {featureText}
        </span>
        <Cursor cursorColor="#314158" />
      </div>
    </>
  );
}

export { TypeWriter };
