"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Loader2, FileText, CheckCircle2 } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Badge } from "@/components/ui/badge"
import { useGlobalState } from "@/components/global-state"

export function ReportGenerator({ data }: { data: any }) {
  const reportRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { currency } = useGlobalState()
  
  const symbol = currency === "USD" ? "$" : "₹"
  const multiplier = currency === "USD" ? 1 / 83 : 1

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return
    
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200, // Fixed width for consistent rendering
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt", // Using points for better precision with html2canvas
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST')
      pdf.save(`CloudPulse_Report_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Report Preview</h2>
        <Button onClick={handleDownloadPDF} disabled={isGenerating}>
          {isGenerating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...</>
          ) : (
            <><Download className="mr-2 h-4 w-4" /> Download PDF</>
          )}
        </Button>
      </div>

      <Card className="overflow-hidden border-2 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <div ref={reportRef} className="bg-white text-black p-8 sm:p-12 min-h-[800px]">
          {/* Report Header */}
          <div className="flex items-center justify-between border-b pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CloudPulse FinOps</h1>
                <p className="text-sm text-gray-500">Executive Optimization Report</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Generated On</p>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Executive Summary</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm font-medium text-gray-500">Potential Monthly Savings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{symbol}{Math.round(data.totalWaste * multiplier).toLocaleString('en-US')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm font-medium text-gray-500">Optimization Score</p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-3xl font-bold text-gray-900">{data.optimizationScore}</p>
                  <span className="text-sm text-gray-500 mb-1">/ 100</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm font-medium text-gray-500">Active Opportunities</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{data.issuesCount}</p>
              </div>
            </div>
          </div>

          {/* Detailed Findings */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Detailed Findings</h2>
            
            {data.issues.length === 0 ? (
              <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg border border-dashed">
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900">Infrastructure is fully optimized</p>
                  <p className="text-sm text-gray-500 mt-1">No cost leaks detected across your AWS environment.</p>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase border-b">
                    <tr>
                      <th className="px-6 py-3">Resource ID</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3 text-right">Estimated Waste</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.issues.sort((a: any, b: any) => b.monthlyLeakage - a.monthlyLeakage).map((issue: any, idx: number) => (
                      <tr key={idx} className="bg-white border-b last:border-0 hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {issue.name || issue.id}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-gray-200">
                            {issue.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-red-600">
                          {symbol}{Math.round(issue.monthlyLeakage * multiplier).toLocaleString('en-US')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Plan */}
          <div className="mt-8 mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">5-Step Remediation Plan</h2>
            <ol className="list-decimal pl-5 space-y-3 text-sm text-gray-800">
              <li><strong>Review Idle Compute:</strong> Terminate or stop the listed instances with &lt;5% CPU utilization to halt immediate compute charges.</li>
              <li><strong>Cleanup Unattached Storage:</strong> Delete EBS volumes that are no longer attached to any active instance.</li>
              <li><strong>Modernize Block Storage:</strong> Modify existing gp2 volumes to gp3 for up to 20% savings and improved performance.</li>
              <li><strong>Enable Intelligent Tiering:</strong> Apply S3 lifecycle rules to transition rarely accessed objects to lower-cost tiers.</li>
              <li><strong>Release Unassociated IPs:</strong> Release Elastic IPs that are allocating costs without being attached to running resources.</li>
            </ol>
          </div>
          
          <div className="mt-16 text-center text-xs text-gray-400">
            Internal Confidential &bull; Generated via CloudPulse FinOps Copilot
          </div>
        </div>
      </Card>
    </div>
  )
}
