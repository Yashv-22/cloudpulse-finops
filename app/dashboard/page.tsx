import { getAggregatedInsights } from "@/actions/aws/overview";
import { KPICards } from "@/components/dashboard/KPICards";
import { MainChart } from "@/components/dashboard/MainChart";
import { ResourceDistributionChart } from "@/components/dashboard/ResourceDistributionChart";
import { ActionTable } from "@/components/dashboard/ActionTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function DashboardOverview() {
  const { totalWaste, optimizationScore, issuesCount, issues, errors } = await getAggregatedInsights();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Executive Summary</h1>
        <p className="text-muted-foreground mt-1">Comprehensive view of AWS infrastructure risk, waste, and recovery potential.</p>
      </div>

      {errors && errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Partial Data Loaded</AlertTitle>
          <AlertDescription>
            Some AWS services could not be analyzed due to permissions or api limits:
            <ul className="list-disc pl-5 mt-2">
              {errors.map((err, i) => (
                <li key={i}>{typeof err === 'string' ? err : err.message || "Unknown error"}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <KPICards totalWaste={totalWaste} score={optimizationScore} activeCount={issuesCount} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <MainChart totalWaste={totalWaste} />
        </div>
        <div className="lg:col-span-3">
          <ResourceDistributionChart issues={issues} />
        </div>
      </div>

      <div className="grid gap-6">
        <ActionTable issues={issues} />
      </div>
    </div>
  );
}
