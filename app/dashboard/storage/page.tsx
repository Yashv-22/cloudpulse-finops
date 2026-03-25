"use client"

import { useState, useEffect } from "react"
import { getStorageOpportunities } from "@/actions/aws/storage"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Database, Loader2, ArrowRightLeft, HardDrive } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RemediationDialog } from "@/components/dashboard/RemediationDialog"
import { useGlobalState } from "@/components/global-state"

export default function StoragePage() {
  const [data, setData] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [isFixModalOpen, setIsFixModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  
  const { currency } = useGlobalState()
  const symbol = currency === "USD" ? "$" : "₹"
  const multiplier = currency === "USD" ? 1 / 83 : 1

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getStorageOpportunities()
        if (res.errors && res.errors.length > 0) setErrors(res.errors)
        if (res.data) setData(res.data)
      } catch (err: any) {
        setErrors([err.message || "Failed to load storage data"])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleFixClick = (item: any) => {
    setSelectedItem(item)
    setIsFixModalOpen(true)
  }

  const handleAction = async () => {
    setActionLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setData(prev => prev.filter(item => item.id !== selectedItem.id))
    setActionLoading(false)
    setIsFixModalOpen(false)
    setSelectedItem(null)
  }

  // Derived mock data or filtered data for GP2 modernization
  // For demo, we just simulate any EBS volume as gp2 if not explicitly stated, or just list 1 if none.
  const gp2Volumes = data.filter(d => typeof d.type === 'string' && d.type.includes('EBS')).map(vol => ({
    ...vol,
    gp3Savings: Math.round(vol.size * 1.6) // Mock savings calculation for moving from gp2 to gp3 (e.g. 20% cheaper)
  }))

  const getRemediationProps = () => {
    if (!selectedItem) return null
    
    if (selectedItem.type.includes("EBS")) {
      return {
        title: `Delete Unattached Volume ${selectedItem.id}`,
        why: `Unattached EBS volumes accrue monthly charges without providing any benefit. Deleting it saves money instantly.`,
        cliCommand: `aws ec2 delete-volume --volume-id ${selectedItem.id} --region ap-south-1`,
        terraformSnippet: `# Terraform:\n# Locate the aws_ebs_volume or aws_instance mapping and safely remove the unattached volume block.`,
        riskLevel: "Medium" as const,
        actionLabel: "Delete Volume"
      }
    } else {
      return {
        title: `Enable S3 Intelligent-Tiering for ${selectedItem.id}`,
        why: `S3 Intelligent-Tiering automatically moves objects between access tiers when access patterns change, optimizing costs without impact.`,
        cliCommand: `aws s3api put-bucket-lifecycle-configuration --bucket ${selectedItem.id} --lifecycle-configuration '{"Rules":[{"Status":"Enabled","Filter":{"Prefix":""},"Transitions":[{"Days":0,"StorageClass":"INTELLIGENT_TIERING"}]}]}'`,
        terraformSnippet: `resource "aws_s3_bucket_lifecycle_configuration" "tiering" {\n  bucket = "${selectedItem.id}"\n\n  rule {\n    id     = "intelligent-tiering"\n    status = "Enabled"\n    transition {\n      days          = 0\n      storage_class = "INTELLIGENT_TIERING"\n    }\n  }\n}`,
        riskLevel: "Low" as const,
        actionLabel: "Enable Tiering"
      }
    }
  }

  const modProps = getRemediationProps()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Storage Optimization</h1>
        <p className="text-muted-foreground mt-1">Review unattached volumes and modernize legacy storage.</p>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Errors Loading Data</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-1">
              {errors.map((e, i) => <li key={i}>{typeof e === 'string' ? e : "Unknown error"}</li>)}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Modernization Tab/Section */}
      {gp2Volumes.length > 0 && (
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-500">
              <ArrowRightLeft className="h-5 w-5" />
              Modernization (GP2 → GP3)
            </CardTitle>
            <CardDescription className="text-blue-500/80">
              Upgrade older gp2 volumes to gp3 for up to 20% lower price point and configurable performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-blue-500/20">
                  <TableHead>Volume ID</TableHead>
                  <TableHead>Current Type</TableHead>
                  <TableHead>Size (GB)</TableHead>
                  <TableHead className="text-right text-emerald-500">Est. Savings (GP3)</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gp2Volumes.map((vol, idx) => (
                  <TableRow key={`gp2-${idx}`} className="border-blue-500/10">
                    <TableCell className="font-mono text-xs">{vol.id}</TableCell>
                    <TableCell><Badge variant="outline" className="border-blue-500/30 text-blue-500">gp2</Badge></TableCell>
                    <TableCell>{vol.size || "-"}</TableCell>
                    <TableCell className="text-right text-emerald-500 font-bold">
                      {symbol}{(vol.gp3Savings * multiplier).toLocaleString('en-US')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="secondary" size="sm" onClick={() => handleFixClick(vol)} className="bg-blue-500 text-white hover:bg-blue-600">
                        Modify Volume
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Opportunities
          </CardTitle>
          <CardDescription>EBS volumes that are unattached and S3 buckets missing Intelligent Tiering.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-muted-foreground flex-col gap-2">
              <HardDrive className="w-16 h-16 opacity-30 mx-auto mb-2" />
              <span>No storage optimizations found. Excellent!</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource ID / Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size (GB)</TableHead>
                  <TableHead className="text-right">Est. Monthly Cost</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, idx) => (
                  <TableRow key={`${item.id}-${idx}`}>
                    <TableCell className="font-medium text-sm">
                      <div className="truncate max-w-[250px]" title={item.id}>{item.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.type.includes("EBS") ? "default" : "secondary"}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={item.type.includes("EBS") ? "text-amber-500 border-amber-500/50" : "text-blue-500 border-blue-500/50"}>
                        {item.type.includes("EBS") ? "Unattached" : "Standard Tier"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.size ? item.size : "-"}
                    </TableCell>
                    <TableCell className="text-right text-rose-500 font-medium">
                      {symbol}{Math.round(item.monthlyLeakage * multiplier).toLocaleString('en-US')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleFixClick(item)}>
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

      {isFixModalOpen && modProps && (
        <RemediationDialog
          isOpen={isFixModalOpen}
          onClose={() => setIsFixModalOpen(false)}
          title={modProps.title}
          why={modProps.why}
          cliCommand={modProps.cliCommand}
          terraformSnippet={modProps.terraformSnippet}
          riskLevel={modProps.riskLevel}
          actionLabel={modProps.actionLabel}
          onAction={handleAction}
          actionLoading={actionLoading}
        />
      )}
    </div>
  )
}
