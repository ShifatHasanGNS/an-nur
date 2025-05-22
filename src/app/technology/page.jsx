"use client";
import { useEffect, useState } from "react";

export default function news() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/tech")
      .then((res) => res.text())
      .then((html) => {
        setContent(html);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Technology Blogs</h1>
      <div className="mt-4" dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
}
