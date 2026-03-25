"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "INR" | "USD";

export interface CustomStorageItem {
  id: string;
  name: string;
  type: string;
  size: number;
  monthlyLeakage: number;
  status: string;
}

interface GlobalStateContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  demoMode: boolean;
  setDemoMode: (d: boolean) => void;
  exchangeRate: number;
  lastScanned: Date | null;
  setLastScanned: (d: Date) => void;
  totalScanned: number;
  setTotalScanned: (n: number) => void;
  customStorage: CustomStorageItem[];
  addCustomStorage: (item: CustomStorageItem) => void;
  updateCustomStorage: (item: CustomStorageItem) => void;
  removeCustomStorage: (id: string) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export function GlobalProvider({ children, initialExchangeRate = 83.5 }: { children: React.ReactNode, initialExchangeRate?: number }) {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [lastScanned, setLastScanned] = useState<Date | null>(null);
  const [totalScanned, setTotalScanned] = useState<number>(0);
  const [customStorage, setCustomStorage] = useState<CustomStorageItem[]>([]);

  useEffect(() => {
    setIsMounted(true);
    // Check cookie or local storage if needed on mount
    const match = document.cookie.match(/(^| )cf_demo_mode=([^;]+)/);
    if (match && match[2] === "true") {
      setDemoMode(true);
    }
    const stored = localStorage.getItem('cf_custom_storage');
    if (stored) {
      try {
        setCustomStorage(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const handleSetDemoMode = (val: boolean) => {
    setDemoMode(val);
    document.cookie = `cf_demo_mode=${val}; path=/; max-age=31536000`; // 1 year expiry
  };

  // Removed if (!isMounted) return <>{children}</> to prevent Context missing on SSR

  const addCustomStorage = (item: CustomStorageItem) => {
    setCustomStorage(prev => {
      const updated = [...prev, item];
      localStorage.setItem('cf_custom_storage', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCustomStorage = (item: CustomStorageItem) => {
    setCustomStorage(prev => {
      const updated = prev.map(i => i.id === item.id ? item : i);
      localStorage.setItem('cf_custom_storage', JSON.stringify(updated));
      return updated;
    });
  };

  const removeCustomStorage = (id: string) => {
    setCustomStorage(prev => {
      const updated = prev.filter(i => i.id !== id);
      localStorage.setItem('cf_custom_storage', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <GlobalStateContext.Provider value={{ 
      currency, setCurrency, 
      demoMode, setDemoMode: handleSetDemoMode, 
      exchangeRate: initialExchangeRate,
      lastScanned, setLastScanned,
      totalScanned, setTotalScanned,
      customStorage, addCustomStorage, updateCustomStorage, removeCustomStorage
    }}>
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
