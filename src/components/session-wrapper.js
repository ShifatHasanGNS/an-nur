"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

const SessionWrapepr = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export { SessionWrapepr };
