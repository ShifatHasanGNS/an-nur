import { memo } from "react";
import Link from "next/link";

const Brand = memo(function Brand({ nameValue }) {
  return (
    <Link href="/" className="cursor-pointer">
      <span className="text-slate-100 text-2xl font-extrabold font-serif">
        An-Nur
      </span>
      <span className="text-slate-600 text-2xl">{" / "}</span>
      <span className="text-slate-400 text-xl font-light font-sans">
        {nameValue}
      </span>
    </Link>
  );
});

export { Brand };
