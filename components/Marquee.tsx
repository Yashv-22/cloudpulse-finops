"use client";

import { useGlobalState } from "@/components/global-state";

export function Marquee() {
  const { currency, exchangeRate } = useGlobalState();
  const value = currency === "USD" ? 14200 / exchangeRate : 14200;
  const symbol = currency === "USD" ? "$" : "₹";
  
  return (
    <div className="flex bg-primary text-primary-foreground text-xs justify-center py-1.5 font-medium z-50 relative">
      <span className="flex items-center gap-2">
        Total Savings Expected: {symbol}{Math.round(value).toLocaleString('en-US')}
      </span>
    </div>
  );
}
