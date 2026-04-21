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
    // Current realistic USD to INR exchange rate (~83.50)
    // If the exact user example was needed: 91162.55 / 974 = 93.596047
    // Using 93.596047 to strictly hit the user's specific mathematical example "$974 = Rs. 91,162.55"
    const rate = currency === "INR" ? 93.596047 : 1.0;
    const value = amount * rate;
    
    if (currency === "INR") {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value).replace('₹', 'Rs. ');
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
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
