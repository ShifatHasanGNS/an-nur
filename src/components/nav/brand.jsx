import { memo } from "react";
import Link from "next/link";

const Brand = memo(function Brand({ nameValue }) {
  return (
    <Link
      href="/"
      className="cursor-pointer hover:bg-slate-800/40 px-4 py-2 rounded-lg transition-all duration-300 shadow-[0_4px_16px_0_rgba(31,38,135,0.1)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-sm"
    >
      <span className="text-md sm:text-2xl font-extrabold font-serif bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 bg-clip-text text-transparent">
        An-Nur
      </span>
      <span className="text-slate-400/80 text-md sm:text-2xl font-serif">
        {" / "}
      </span>
      <span className="text-slate-300/90 text-sm sm:text-xl font-light font-sans">
        {nameValue}
      </span>
    </Link>
  );
});

export { Brand };
