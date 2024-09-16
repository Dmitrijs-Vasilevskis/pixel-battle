"use client";

import React, { useEffect } from "react";
import { GlobalProvider } from "../context/GlobalProvider";

interface Props {
  children: React.ReactNode;
}

export default function ContextProvider({ children }: Props) {
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return null;
  }
  return (
    <GlobalProvider>
      {children}
    </GlobalProvider>
  );
}
