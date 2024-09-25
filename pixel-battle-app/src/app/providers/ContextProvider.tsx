"use client";

import React, { useEffect, useState } from "react";
import { GlobalProvider } from "../context/GlobalProvider";
import { Toaster } from "react-hot-toast";

interface Props {
  children: React.ReactNode;
}

export default function ContextProvider({ children }: Props) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, [isInitialized]);

  if (!isInitialized) {
    return null;
  }
  return (
    <GlobalProvider>
      <Toaster />
      {children}
    </GlobalProvider>
  );
}
