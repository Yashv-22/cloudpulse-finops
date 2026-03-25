import { getAggregatedInsights } from "@/actions/aws/overview"
import { ReportGenerator } from "@/components/dashboard/ReportGenerator"

export default async function ReportsPage() {
  const data = await getAggregatedInsights()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FinOps Reports</h1>
        <p className="text-muted-foreground mt-1">Generate and download comprehensive cost optimization reports.</p>
      </div>

      <ReportGenerator data={data} />
    </div>
  )
}
