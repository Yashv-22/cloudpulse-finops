"use server";

import { getEC2Client, getS3Client } from "@/lib/aws/client";
import { DescribeVolumesCommand } from "@aws-sdk/client-ec2";
import { ListBucketsCommand, GetBucketIntelligentTieringConfigurationCommand } from "@aws-sdk/client-s3";
import { cookies } from "next/headers";

export async function getUnattachedEBS() {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get("cf_demo_mode")?.value === "true";
  if (isDemo) {
    return {
      data: [
        { id: "vol-0987654321fedcba1", type: "EBS (gp2)", size: 100, monthlyLeakage: 950 },
        { id: "vol-0987654321fedcba2", type: "EBS (gp2)", size: 100, monthlyLeakage: 950 },
      ]
    };
  }
  try {
    const ec2 = await getEC2Client();
    const res = await ec2.send(
      new DescribeVolumesCommand({
        Filters: [{ Name: "status", Values: ["available"] }]
      })
    );
    
    const unattached = res.Volumes?.map(v => ({
      id: v.VolumeId,
      type: v.VolumeType || "EBS Volume",
      size: v.Size || 0,
      monthlyLeakage: (v.Size || 0) * 8.3, // roughly 0.1$ per GB -> ~8.3 INR per GB
    })) || [];
    
    return { data: unattached };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getUnoptimizedS3() {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get("cf_demo_mode")?.value === "true";
  if (isDemo) {
    return {
      data: [
        { id: "customer-data-backups-2023", type: "S3 Bucket", monthlyLeakage: 1850 },
        { id: "app-logs-archive-prod", type: "S3 Bucket", monthlyLeakage: 850 },
      ]
    };
  }
  try {
    const s3 = await getS3Client();
    const listRes = await s3.send(new ListBucketsCommand({}));
    
    const unoptimized = [];
    if (listRes.Buckets) {
      for (const b of listRes.Buckets) {
        const name = b.Name!;
        try {
          const tierRes = await s3.send(new GetBucketIntelligentTieringConfigurationCommand({ Bucket: name, Id: "default" }));
        } catch (err: any) {
          if (err.name === "NoSuchConfiguration" || err?.message?.includes("does not exist")) {
            unoptimized.push({
              id: name,
              type: "S3 Bucket",
              monthlyLeakage: 500, // representational waste in INR
            });
          }
        }
      }
    }
    return { data: unoptimized };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getStorageOpportunities() {
  const [ebs, s3] = await Promise.all([
    getUnattachedEBS(),
    getUnoptimizedS3()
  ]);

  return {
    data: [
      ...(ebs.data || []),
      ...(s3.data || [])
    ],
    errors: [ebs.error, s3.error].filter(Boolean)
  };
}
