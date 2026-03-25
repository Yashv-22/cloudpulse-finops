"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useGlobalState } from "@/components/global-state"

export function ActionTable({ issues, errors, compact = false }: { issues: any[], errors?: any[], compact?: boolean }) {
  const { currency, exchangeRate } = useGlobalState()
  const symbol = currency === "USD" ? "$" : "₹"
  const multiplier = currency === "USD" ? 1 / exchangeRate : 1
  if (issues.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Opportunities</CardTitle>
          <CardDescription>Top resources to optimize.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6 text-muted-foreground h-48">
          No actionable items found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Opportunities</CardTitle>
        <CardDescription>Top resources to optimize.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto p-6">
        {errors && errors.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap pb-4 border-b">
            <span className="text-sm font-medium text-destructive flex items-center">Alert:</span>
            {errors.map((err, i) => (
              <Badge key={i} variant="destructive" className="bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20">
                {err.service}: Missing Permissions
              </Badge>
            ))}
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Waste/Mo</TableHead>
              {!compact && <TableHead></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue, i) => (
              <TableRow key={`${issue.id}-${i}`}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="truncate max-w-[150px]" title={issue.name || issue.id}>{issue.name || issue.id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal text-xs">{issue.type}</Badge>
                </TableCell>
                <TableCell className="text-right">{symbol}{Math.round(issue.monthlyLeakage * multiplier).toLocaleString('en-US')}</TableCell>
                {!compact && (
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Fix</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
