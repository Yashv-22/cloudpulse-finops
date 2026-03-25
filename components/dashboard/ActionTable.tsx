"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ActionTable({ issues, compact = false }: { issues: any[], compact?: boolean }) {
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
      <CardContent className="flex-grow overflow-auto">
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
                <TableCell className="text-right">₹{issue.monthlyLeakage.toLocaleString('en-IN')}</TableCell>
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
