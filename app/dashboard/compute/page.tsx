"use client"

import { useState, useEffect } from "react"
import { getIdleEC2Instances } from "@/actions/aws/compute"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, TerminalSquare, Loader2, Cpu } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RemediationDialog } from "@/components/dashboard/RemediationDialog"
import { useGlobalState } from "@/components/global-state"

export default function ComputePage() {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedInstance, setSelectedInstance] = useState<any | null>(null)
  const [isFixModalOpen, setIsFixModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  
  const { currency } = useGlobalState()
  const symbol = currency === "USD" ? "$" : "₹"
  const multiplier = currency === "USD" ? 1 / 83 : 1

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getIdleEC2Instances()
        if (res.error) setError(res.error)
        if (res.data) setData(res.data)
      } catch (err: any) {
        setError(err.message || "Failed to load compute data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleFixClick = (instance: any) => {
    setSelectedInstance(instance)
    setIsFixModalOpen(true)
  }

  const handleAction = async () => {
    setActionLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setData(prev => prev.filter(inst => inst.id !== selectedInstance.id))
    setActionLoading(false)
    setIsFixModalOpen(false)
    setSelectedInstance(null)
  }

  const gravitonSavings = Math.round(3400 * multiplier)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compute Resources</h1>
        <p className="text-muted-foreground mt-1">Review and optimize your EC2 instances.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Graviton Comparison Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Modernize with Graviton4 (ARM)
              <Badge variant="outline" className="border-primary text-primary">High Impact</Badge>
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Migrating compatible workloads to AWS Graviton4 processors would save you approximately {" "}
              <strong className="text-foreground">{symbol}{gravitonSavings}/month</strong> with 40% better price-performance.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TerminalSquare className="h-5 w-5" />
            Idle EC2 Instances
          </CardTitle>
          <CardDescription>Instances with average CPU utilization below 5%.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-muted-foreground flex-col gap-2">
              <img src="https://api.dicebear.com/7.x/shapes/svg?seed=optimized&backgroundColor=transparent" alt="Optimized" className="w-24 h-24 opacity-50 grayscale" />
              <span>Congrats! Your cloud is 100% lean and optimized.</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instance ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Avg CPU</TableHead>
                  <TableHead className="text-right">Est. Monthly Cost</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((inst) => (
                  <TableRow key={inst.id} className="bg-destructive/5 hover:bg-destructive/10 transition-colors">
                    <TableCell className="font-mono text-xs text-primary">{inst.id}</TableCell>
                    <TableCell className="font-medium">{inst.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">{inst.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 shadow-none border-none">
                        Under-utilized
                      </Badge>
                    </TableCell>
                    <TableCell className="text-rose-500 font-medium">{inst.avgCpu}%</TableCell>
                    <TableCell className="text-right font-semibold">
                      {symbol}{Math.round(inst.monthlyLeakage * multiplier).toLocaleString('en-US')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleFixClick(inst)}>
                        View Fix
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedInstance && (
        <RemediationDialog
          isOpen={isFixModalOpen}
          onClose={() => setIsFixModalOpen(false)}
          title={`Stop Instance ${selectedInstance.id}`}
          why={`Instance is running at ${selectedInstance.avgCpu}% CPU, accumulating wasteful compute charges.`}
          cliCommand={`aws ec2 stop-instances --instance-ids ${selectedInstance.id} --region ap-south-1`}
          terraformSnippet={`# If managed via Terraform, consider changing the instance state or count:\n\nresource "aws_instance" "${selectedInstance.name || "example"}" {\n  # count         = 0  // to terminate\n  instance_state = "stopped" // to halt\n  instance_type  = "${selectedInstance.type}"\n  ...\n}`}
          riskLevel="High"
          actionLabel="Stop Instance"
          onAction={handleAction}
          actionLoading={actionLoading}
        />
      )}
    </div>
  )
}
