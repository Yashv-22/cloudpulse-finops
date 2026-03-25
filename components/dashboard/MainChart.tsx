"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useGlobalState } from "@/components/global-state";

export function MainChart({ totalWaste }: { totalWaste: number }) {
  const { currency } = useGlobalState();
  const conversionRate = currency === "USD" ? 1 / 83 : 1;
  const symbol = currency === "USD" ? "$" : "₹";

  const data = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    const month = d.toLocaleString('default', { month: 'short' });
    
    // Simulate savings over time
    const baseProjected = totalWaste * 1.2 * (1 + i * 0.05); // Grows by 5% per month
    const baseOptimized = totalWaste * 0.3 * (1 + i * 0.01); // Optimized stays lower

    return {
      month,
      Projected: Math.round(baseProjected * conversionRate),
      Optimized: Math.round(baseOptimized * conversionRate)
    };
  });

  return (
    <Card className="flex flex-col h-full shadow-md border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>12-Month Spending Forecast</CardTitle>
        <CardDescription>Projected Unoptimized vs. Optimized Infrastructure Costs.</CardDescription>
      </CardHeader>
      <CardContent className="pl-0 flex-grow min-h-[300px]">
        {totalWaste > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
              <XAxis 
                dataKey="month" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${symbol}${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: 'white' }}
                formatter={(value: any) => [`${symbol}${Number(value).toLocaleString('en-US')}`, undefined]}
              />
              <Area type="monotone" dataKey="Projected" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorProjected)" />
              <Area type="monotone" dataKey="Optimized" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOptimized)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No forecast data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
