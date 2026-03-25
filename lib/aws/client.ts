import { getSession } from "@/lib/session";
import { USE_DEMO_MODE } from "@/lib/config";
import { EC2Client, DescribeRegionsCommand } from "@aws-sdk/client-ec2";
import { S3Client } from "@aws-sdk/client-s3";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { IAMClient } from "@aws-sdk/client-iam";

export async function getAWSConfig(regionOverride?: string) {
  const session = await getSession();
  
  if (USE_DEMO_MODE) {
    return {
      region: regionOverride || session.region || "ap-south-1",
      credentials: {
        accessKeyId: "demo-key",
        secretAccessKey: "demo-secret",
      },
    };
  }

  if (!session.isLoggedIn || !session.accessKeyId || !session.secretAccessKey) {
    throw new Error("Unauthorized: Missing AWS credentials in session");
  }

  return {
    region: regionOverride || session.region || "us-east-1",
    credentials: {
      accessKeyId: session.accessKeyId,
      secretAccessKey: session.secretAccessKey,
    },
  };
}

export async function getEC2Client(regionOverride?: string) {
  return new EC2Client(await getAWSConfig(regionOverride));
}

export async function getS3Client(regionOverride?: string) {
  return new S3Client(await getAWSConfig(regionOverride));
}

export async function getCloudWatchClient(regionOverride?: string) {
  return new CloudWatchClient(await getAWSConfig(regionOverride));
}

export async function getIAMClient(regionOverride?: string) {
  return new IAMClient(await getAWSConfig(regionOverride));
}

export async function getEnabledRegions() {
  try {
    const ec2 = await getEC2Client();
    const res = await ec2.send(new DescribeRegionsCommand({}));
    return res.Regions?.map(r => r.RegionName!) || ["us-east-1"];
  } catch (err) {
    console.error("Failed to fetch regions", err);
    return ["us-east-1"];
  }
}
