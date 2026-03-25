"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function SystemHealthChart() {
  // Static scores representing optimized architecture grade across pillars.
  // In a real app, these would be derived from the global state/scans.
  const data = [
    { subject: "Compute", A: 85, fullMark: 100 },
    { subject: "Storage", A: 60, fullMark: 100 },
    { subject: "Network", A: 90, fullMark: 100 },
    { subject: "Security", A: 75, fullMark: 100 },
    { subject: "Cost", A: 82, fullMark: 100 },
  ];

  return (
    <Card className="col-span-3 hover:border-primary/50 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Overall System Health
        </CardTitle>
        <CardDescription>
          Multi-dimensional posture analysis across the primary architecture pillars.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#4b5563" strokeOpacity={0.4} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 600 }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                borderColor: '#374151',
                borderRadius: '8px',
                color: '#f9fafb'
              }}
              itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
            />
            <Radar
              name="Optimization Score"
              dataKey="A"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.4}
              activeDot={{ r: 6, fill: "#60a5fa" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
