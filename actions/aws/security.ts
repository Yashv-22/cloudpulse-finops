"use server";

import { getS3Client, getIAMClient } from "@/lib/aws/client";
import { ListBucketsCommand, GetPublicAccessBlockCommand } from "@aws-sdk/client-s3";
import { ListUsersCommand, ListMFADevicesCommand } from "@aws-sdk/client-iam";
import { cookies } from "next/headers";

export async function getOpenS3Buckets() {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get("cf_demo_mode")?.value === "true";
  
  if (isDemo) {
    return {
      data: [
        { id: "public-assets-prod", type: "Security (S3)", monthlyLeakage: 0, region: "Global" },
      ]
    };
  }

  try {
    const s3 = await getS3Client();
    const listRes = await s3.send(new ListBucketsCommand({}));
    const openBuckets: any[] = [];

    if (listRes.Buckets) {
      for (const b of listRes.Buckets) {
        const name = b.Name!;
        try {
          const pubBlock = await s3.send(new GetPublicAccessBlockCommand({ Bucket: name }));
          const conf = pubBlock.PublicAccessBlockConfiguration;
          if (!conf?.BlockPublicAcls || !conf?.BlockPublicPolicy || !conf?.IgnorePublicAcls || !conf?.RestrictPublicBuckets) {
            openBuckets.push({
              id: `${name} (Open Bucket)`,
              type: "Security (S3)",
              monthlyLeakage: 0, // Security risk doesn't have direct monthly leakage in FinOps but is critical
              region: "Global"
            });
          }
        } catch (err: any) {
          if (err.name === "NoSuchPublicAccessBlockConfiguration") {
            // No block config means it might be open
            openBuckets.push({
              id: `${name} (No Public Block)`,
              type: "Security (S3)",
              monthlyLeakage: 0,
              region: "Global"
            });
          }
        }
      }
    }
    return { data: openBuckets };
  } catch (error: any) {
    return { error: { service: "Security (S3)", message: "Permissions Required" } };
  }
}

export async function getIAMUsersWithoutMFA() {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get("cf_demo_mode")?.value === "true";

  if (isDemo) {
    return {
      data: [
        { id: "alice_developer", type: "Security (IAM)", monthlyLeakage: 0, region: "Global" },
        { id: "bob_admin", type: "Security (IAM)", monthlyLeakage: 0, region: "Global" },
      ]
    };
  }

  try {
    const iam = await getIAMClient("us-east-1"); // IAM is global but endpoint can be us-east-1
    const usersRes = await iam.send(new ListUsersCommand({}));
    const riskUsers: any[] = [];

    if (usersRes.Users) {
      for (const u of usersRes.Users) {
        try {
          const mfaRes = await iam.send(new ListMFADevicesCommand({ UserName: u.UserName }));
          if (!mfaRes.MFADevices || mfaRes.MFADevices.length === 0) {
            riskUsers.push({
              id: `${u.UserName} (No MFA)`,
              type: "Security (IAM)",
              monthlyLeakage: 0,
              region: "Global"
            });
          }
        } catch (err: any) {
          // ignore individual user evaluation
        }
      }
    }
    return { data: riskUsers };
  } catch (error: any) {
    return { error: { service: "Security (IAM)", message: "Permissions Required" } };
  }
}

export async function getSecurityOpportunities() {
  const [s3, iam] = await Promise.all([
    getOpenS3Buckets(),
    getIAMUsersWithoutMFA()
  ]);

  return {
    data: [
      ...(s3.data || []),
      ...(iam.data || [])
    ],
    errors: [s3.error, iam.error].filter(Boolean)
  };
}
