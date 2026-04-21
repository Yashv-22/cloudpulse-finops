"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  initialState?: boolean;
  onChange?: (state: boolean) => void;
}

export function ToggleSwitch({ initialState = false, onChange }: ToggleSwitchProps) {
  const [enabled, setEnabled] = useState(initialState);

  const toggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    if (onChange) onChange(newState);
  };

  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30",
        enabled ? "bg-[#007AFF]" : "bg-[var(--border-strong)]"
      )}
      onClick={toggle}
      data-testid="toggle-switch"
    >
      <span className="sr-only">Toggle</span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          enabled ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}
