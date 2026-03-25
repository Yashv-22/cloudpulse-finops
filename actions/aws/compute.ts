"use server";

import { getEC2Client, getCloudWatchClient, getEnabledRegions } from "@/lib/aws/client";
import { DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch";
import { cookies } from "next/headers";

export async function getIdleEC2Instances() {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get("cf_demo_mode")?.value === "true";
  
  if (isDemo) {
    return {
      data: [
        { id: "i-0abcd1234efgh5671", type: "t3.medium", name: "dev-server-1", avgCpu: 0.8, monthlyLeakage: 2700, region: "ap-south-1" },
        { id: "i-0abcd1234efgh5672", type: "t3.medium", name: "dev-server-2", avgCpu: 0.4, monthlyLeakage: 2700, region: "ap-south-1" },
        { id: "i-0abcd1234efgh5673", type: "t3.medium", name: "staging-worker", avgCpu: 0.9, monthlyLeakage: 2700, region: "us-east-1" },
        { id: "i-0abcd1234efgh5674", type: "t3.medium", name: "test-db-replica", avgCpu: 0.2, monthlyLeakage: 2700, region: "eu-central-1" },
      ]
    };
  }
  
  try {
    const regions = await getEnabledRegions();
    const allIdleInstances: any[] = [];
    const now = new Date();
    const startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    await Promise.all(
      regions.map(async (region) => {
        try {
          const ec2 = await getEC2Client(region);
          const cw = await getCloudWatchClient(region);
          
          const describeRes = await ec2.send(
            new DescribeInstancesCommand({
              Filters: [{ Name: "instance-state-name", Values: ["running"] }]
            })
          );

          const instances: any[] = [];
          if (describeRes.Reservations) {
            for (const res of describeRes.Reservations) {
              if (res.Instances) {
                for (const inst of res.Instances) {
                  instances.push({
                    id: inst.InstanceId,
                    type: inst.InstanceType,
                    name: inst.Tags?.find?.(t => t.Key === "Name")?.Value || "Unknown",
                    region
                  });
                }
              }
            }
          }

          if (instances.length === 0) return;

          for (const inst of instances) {
            try {
              const metrics = await cw.send(new GetMetricStatisticsCommand({
                Namespace: "AWS/EC2",
                MetricName: "CPUUtilization",
                Dimensions: [{ Name: "InstanceId", Value: inst.id! }],
                StartTime: startTime,
                EndTime: now,
                Period: 86400, // 1 day
                Statistics: ["Average"]
              }));

              const averages = metrics.Datapoints?.map(d => d.Average!) || [];
              const avgCpu = averages.length > 0 ? averages.reduce((a, b) => a + b, 0) / averages.length : 0;

              if (avgCpu < 5) {
                allIdleInstances.push({
                  ...inst,
                  avgCpu: Number(avgCpu.toFixed(2)),
                  monthlyLeakage: calculateEstimatedLeakage(inst.type!),
                });
              }
            } catch (err) {
              // Ignore specific instance CW errors
            }
          }
        } catch (regionErr) {
          // Ignore specific region errors
        }
      })
    );

    return { data: allIdleInstances };
  } catch (error: any) {
    return { error: { service: "Compute", message: "Permissions Required" } };
  }
}

function calculateEstimatedLeakage(type: string) {
  // Approximate monthly cost in INR (assuming $1 = ₹83 and generic linux rates)
  const rates: Record<string, number> = {
    "t2.micro": 700,
    "t3.medium": 2400,
    "m5.large": 6500,
    "c5.large": 7000,
  };
  return rates[type] || 2000;
}
