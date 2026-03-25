"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { Search, Sun, Moon, LogOut, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";
import { useGlobalState } from "@/components/global-state";
import Link from "next/link";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency, demoMode, setDemoMode, lastScanned, totalScanned } = useGlobalState();

  useEffect(() => setMounted(true), []);

  return (
    <header className="h-16 border-b border-border bg-card/30 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="outline" className="relative h-9 w-64 justify-start text-sm text-muted-foreground hidden sm:flex bg-background/50">
          <Search className="mr-2 h-4 w-4" />
          <span>Search resources...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
        {mounted && lastScanned && (
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20 font-medium">
              Analyzed {totalScanned.toLocaleString()} resources
            </div>
            <div className="text-muted-foreground">
              Last Scanned: {lastScanned.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-2 border-r border-border pr-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
            className="font-medium"
            title="Toggle Currency"
          >
            {currency === "INR" ? "₹ INR" : "$ USD"}
          </Button>

          <Button
            variant={demoMode ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDemoMode(!demoMode)}
            className={`font-medium ${demoMode ? "bg-primary/20 text-primary border border-primary/30" : ""}`}
            title="Toggle Demo Mode"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {demoMode ? "Demo: ON" : "Demo Mode"}
          </Button>

          <Link href="https://linkedin.com" target="_blank" rel="noreferrer" tabIndex={-1}>
            <Button variant="outline" size="sm" className="hidden md:flex ml-2">
              Need a Custom Audit?
            </Button>
          </Link>
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {mounted ? (
            theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
          ) : (
            <div className="h-5 w-5" /> // Skeleton
          )}
        </Button>
        <form action={logout}>
          <Button variant="ghost" size="icon" type="submit" title="Logout">
            <LogOut className="h-5 w-5 text-destructive" />
          </Button>
        </form>
      </div>
    </header>
  );
}
