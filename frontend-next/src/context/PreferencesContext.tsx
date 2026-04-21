"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface PreferencesContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
  currency: "USD" | "INR";
  toggleCurrency: () => void;
  formatCurrency: (amount: number) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  useEffect(() => {
    // Apply theme class to HTML root
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light-mode");
    } else {
      root.classList.remove("light-mode");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const toggleCurrency = () => {
    setCurrency(prev => (prev === "USD" ? "INR" : "USD"));
  };

  const formatCurrency = (amount: number) => {
    const rate = currency === "INR" ? 83.0 : 1.0;
    const value = amount * rate;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <PreferencesContext.Provider value={{ theme, toggleTheme, currency, toggleCurrency, formatCurrency }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
