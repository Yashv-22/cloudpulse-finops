"use server";

import { getEC2Client, getEnabledRegions } from "@/lib/aws/client";
import { DescribeAddressesCommand } from "@aws-sdk/client-ec2";
import { cookies } from "next/headers";

export async function getUnusedEIPs() {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get("cf_demo_mode")?.value === "true";

  if (isDemo) {
    return {
      data: [
        { id: "eipalloc-0123456789abcdef1", type: "Elastic IP", publicIp: "13.232.1.10", monthlyLeakage: 300, region: "ap-south-1" },
        { id: "eipalloc-0123456789abcdef2", type: "Elastic IP", publicIp: "13.232.1.11", monthlyLeakage: 300, region: "ap-south-1" },
        { id: "eipalloc-0123456789abcdef3", type: "Elastic IP", publicIp: "13.232.1.12", monthlyLeakage: 300, region: "us-east-1" },
        { id: "eipalloc-0123456789abcdef4", type: "Elastic IP", publicIp: "13.232.1.13", monthlyLeakage: 300, region: "us-east-1" },
        { id: "eipalloc-0123456789abcdef5", type: "Elastic IP", publicIp: "13.232.1.14", monthlyLeakage: 300, region: "eu-central-1" },
      ]
    };
  }
  
  try {
    const regions = await getEnabledRegions();
    const allUnused: any[] = [];

    await Promise.all(
      regions.map(async (region) => {
        try {
          const ec2 = await getEC2Client(region);
          const res = await ec2.send(new DescribeAddressesCommand({}));
          
          if (res.Addresses) {
            for (const addr of res.Addresses) {
              if (!addr.AssociationId) {
                allUnused.push({
                  id: addr.AllocationId || addr.PublicIp,
                  type: "Elastic IP",
                  publicIp: addr.PublicIp,
                  monthlyLeakage: 300, // ~ $3.6 per month = ~300 INR
                  region
                });
              }
            }
          }
        } catch (regionErr) {
          // ignore specific region errors
        }
      })
    );
    
    return { data: allUnused };
  } catch (error: any) {
    return { error: { service: "Network", message: "Permissions Required" } };
  }
}
