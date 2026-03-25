import { getSession } from "@/lib/session";
import { USE_DEMO_MODE } from "@/lib/config";
import { EC2Client } from "@aws-sdk/client-ec2";
import { S3Client } from "@aws-sdk/client-s3";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";

export async function getAWSConfig() {
  const session = await getSession();
  
  if (USE_DEMO_MODE) {
    return {
      region: session.region || "ap-south-1",
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
    region: session.region || "us-east-1",
    credentials: {
      accessKeyId: session.accessKeyId,
      secretAccessKey: session.secretAccessKey,
    },
  };
}

export async function getEC2Client() {
  return new EC2Client(await getAWSConfig());
}

export async function getS3Client() {
  return new S3Client(await getAWSConfig());
}

export async function getCloudWatchClient() {
  return new CloudWatchClient(await getAWSConfig());
}
