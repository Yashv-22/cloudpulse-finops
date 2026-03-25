"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useGlobalState } from "@/components/global-state";

export function ResourceDistributionChart({ issues }: { issues: any[] }) {
  const { currency, exchangeRate } = useGlobalState();
  const conversionRate = currency === "USD" ? 1 / exchangeRate : 1;
  const symbol = currency === "USD" ? "$" : "₹";

  // Aggregate waste by resource type (Compute vs Storage vs Network)
  const distribution = issues.reduce((acc, issue) => {
    let category = "Other";
    if (issue.type?.toLowerCase().includes("ec2") || issue.type?.toLowerCase().includes("lambda")) {
      category = "Compute";
    } else if (issue.type?.toLowerCase().includes("ebs") || issue.type?.toLowerCase().includes("s3")) {
      category = "Storage";
    } else if (issue.type?.toLowerCase().includes("eip") || issue.type?.toLowerCase().includes("network")) {
      category = "Network";
    }
    
    if (!acc[category]) acc[category] = 0;
    acc[category] += (issue.monthlyLeakage * conversionRate);
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(distribution).map(key => ({
    name: key,
    value: Math.round(distribution[key])
  })).filter(d => d.value > 0);

  const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <Card className="flex flex-col h-full shadow-md border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Resource Distribution</CardTitle>
        <CardDescription>Where the money goes</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow min-h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: 'white' }}
                formatter={(value: any) => [`${symbol}${Number(value).toLocaleString('en-US')}`, undefined]}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
