"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Loader2, FileText, CheckCircle2 } from "lucide-react"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import { Badge } from "@/components/ui/badge"
import { useGlobalState } from "@/components/global-state"

export function ReportGenerator({ data }: { data: any }) {
  const reportRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { currency, exchangeRate } = useGlobalState()
  
  const symbol = currency === "USD" ? "$" : "₹"
  const multiplier = currency === "USD" ? 1 / exchangeRate : 1

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
        ignoreElements: (element) => {
          // Ignore external stylesheets to prevent parsing crashes on modern CSS colors (like Tailwind v4 oklch)
          if (element.tagName === "STYLE" || element.tagName === "LINK") {
            return true;
          }
           return false;
        }
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
    <>
      <Button onClick={handleDownloadPDF} disabled={isGenerating} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
        {isGenerating ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...</>
        ) : (
          <><Download className="mr-2 h-4 w-4" /> Export PDF</>
        )}
      </Button>

      {/* Hidden container for HTML2Canvas to capture accurately */}
      <div className="absolute top-[-9999px] left-[-9999px]" style={{ width: '1200px' }}>
        <div ref={reportRef} style={{ backgroundColor: '#ffffff', color: '#111827', padding: '3rem', minHeight: '800px', borderTop: '12px solid #2563eb' }}>
          {/* Report Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #f3f4f6', paddingBottom: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'linear-gradient(to bottom right, #2563eb, #1e40af)', padding: '0.75rem', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <FileText style={{ height: '2rem', width: '2rem', color: '#ffffff' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.025em', margin: 0 }}>CloudPulse <span style={{ color: '#2563eb' }}>Enterprise</span></h1>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0.25rem 0 0 0' }}>FinOps & Security Audit Report</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>Generated On</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Executive Summary</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', margin: 0 }}>Potential Monthly Savings</p>
                <p style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', margin: '0.25rem 0 0 0' }}>{symbol}{Math.round(data.totalWaste * multiplier).toLocaleString('en-US')}</p>
              </div>
              <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', margin: 0 }}>Optimization Score</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <p style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', margin: 0 }}>{data.optimizationScore}</p>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>/ 100</span>
                </div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', margin: 0 }}>Active Opportunities</p>
                <p style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', margin: '0.25rem 0 0 0' }}>{data.issuesCount}</p>
              </div>
            </div>
          </div>

          {/* Detailed Findings */}
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Detailed Findings</h2>
            
            {data.issues.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px dashed #e5e7eb' }}>
                <div style={{ textAlign: 'center' }}>
                  <CheckCircle2 style={{ height: '3rem', width: '3rem', color: '#22c55e', margin: '0 auto 0.75rem auto' }} />
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>Infrastructure is fully optimized</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>No cost leaks detected across your AWS environment.</p>
                </div>
              </div>
            ) : (
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', fontSize: '0.875rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb', color: '#374151', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1.5rem', fontWeight: 600 }}>Resource ID</th>
                      <th style={{ padding: '0.75rem 1.5rem', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '0.75rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Estimated Waste</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.issues.sort((a: any, b: any) => b.monthlyLeakage - a.monthlyLeakage).map((issue: any, idx: number) => (
                      <tr key={idx} style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#111827' }}>
                          {issue.name || issue.id}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{ backgroundColor: '#f3f4f6', color: '#1f2937', fontSize: '0.75rem', fontWeight: 600, padding: '0.125rem 0.625rem', borderRadius: '0.25rem', border: '1px solid #e5e7eb' }}>
                            {issue.type}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 500, color: '#dc2626' }}>
                          {symbol}{Math.round((issue.monthlyLeakage || 0) * multiplier).toLocaleString('en-US')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Plan */}
          <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Comprehensive Remediation Plan</h2>
            <ol style={{ listStyleType: 'decimal', paddingLeft: '1.25rem', color: '#1f2937', fontSize: '0.875rem', lineHeight: '1.5' }}>
              <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#111827' }}>Review Idle Compute:</strong> Terminate or stop the listed instances with &lt;5% CPU utilization to halt immediate compute charges.</li>
              <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#111827' }}>Cleanup Unattached Storage:</strong> Delete EBS volumes that are no longer attached to any active instance.</li>
              <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#111827' }}>Modernize Block Storage:</strong> Modify existing gp2 volumes to gp3 for up to 20% savings and improved performance.</li>
              <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#111827' }}>Enable Intelligent Tiering:</strong> Apply S3 lifecycle rules to transition rarely accessed objects to lower-cost tiers.</li>
              <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#111827' }}>Release Unassociated IPs:</strong> Release Elastic IPs that are allocating costs without being attached to running resources.</li>
              <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#111827' }}>Enforce Zero-Trust Security:</strong> Ensure all detected S3 Buckets have Block Public Access enabled and all IAM Users mandate MFA tokens.</li>
            </ol>
          </div>
          
          <div style={{ marginTop: '4rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'monospace' }}>
            <span>Confidential &bull; Proprietary Audit Data</span>
            <span>Generated seamlessly via CloudPulse Enterprise</span>
          </div>
        </div>
      </div>
    </>
  )
}
