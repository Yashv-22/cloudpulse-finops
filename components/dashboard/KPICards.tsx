"use client";

import { AlertCircle, IndianRupee, DollarSign, ShieldCheck, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGlobalState } from "@/components/global-state";

interface KPICardsProps {
  totalWaste: number;
  score: number;
  activeCount: number;
}

export function KPICards({ totalWaste, score, activeCount }: KPICardsProps) {
  const { currency, exchangeRate } = useGlobalState();
  const displayWaste = currency === "USD" ? totalWaste / exchangeRate : totalWaste; // Live API conversion
  const currencySymbol = currency === "USD" ? "$" : "₹";

  const getGrade = (s: number) => {
    if (s >= 90) return { letter: "A+", color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" };
    if (s >= 80) return { letter: "A", color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" };
    if (s >= 70) return { letter: "B", color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" };
    if (s >= 60) return { letter: "C", color: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" };
    if (s >= 50) return { letter: "D", color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20" };
    return { letter: "F", color: "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20" };
  };

  const grade = getGrade(score);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="hover:border-primary/50 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Monthly Savings Potential</CardTitle>
          {currency === "USD" ? <DollarSign className="h-4 w-4 text-muted-foreground" /> : <IndianRupee className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-emerald-500">
            {currencySymbol}
            {displayWaste.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Found in your account</p>
        </CardContent>
      </Card>

      <Card className="hover:border-primary/50 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
          <ShieldCheck className={`h-4 w-4 ${score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'}`} />
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted opacity-20" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * score) / 100}
                className={`transition-all duration-1000 ${score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}
              />
            </svg>
            <span className="absolute text-sm font-bold">{score}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Financial Health</span>
            <span className="text-xs text-muted-foreground">Current state of infra</span>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:border-primary/50 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Zombie Resources</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{activeCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Unused EBS / EIPs / EC2</p>
        </CardContent>
      </Card>

      <Card className="hover:border-primary/50 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Efficiency Grade</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mt-1">
            <Badge className={`${grade.color} tabular-nums text-lg px-3 py-1 font-bold`}>{grade.letter}</Badge>
            <span className="text-xs text-muted-foreground">Based on waste %</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
