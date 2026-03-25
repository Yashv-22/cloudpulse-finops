"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "INR" | "USD";

interface GlobalStateContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  demoMode: boolean;
  setDemoMode: (d: boolean) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check cookie or local storage if needed on mount
    const match = document.cookie.match(/(^| )cf_demo_mode=([^;]+)/);
    if (match && match[2] === "true") {
      setDemoMode(true);
    }
  }, []);

  const handleSetDemoMode = (val: boolean) => {
    setDemoMode(val);
    document.cookie = `cf_demo_mode=${val}; path=/; max-age=31536000`; // 1 year expiry
  };

  if (!isMounted) return <>{children}</>;

  return (
    <GlobalStateContext.Provider value={{ currency, setCurrency, demoMode, setDemoMode: handleSetDemoMode }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalProvider");
  }
  return context;
}
