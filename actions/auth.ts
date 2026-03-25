"use server";

import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { USE_DEMO_MODE } from "@/lib/config";

export async function loginWithAWS(prevState: any, formData: FormData) {
  const accessKeyId = formData.get("accessKeyId") as string;
  const secretAccessKey = formData.get("secretAccessKey") as string;
  const region = (formData.get("region") as string) || "us-east-1";

  if (!accessKeyId || !secretAccessKey) {
    return { error: "Access Key and Secret Key are required." };
  }

  // Demo Mode or Local Testing Bypass
  if (USE_DEMO_MODE || (accessKeyId === "test" && secretAccessKey === "test")) {
    const session = await getSession();
    session.accessKeyId = accessKeyId || "demo-key";
    session.secretAccessKey = secretAccessKey || "demo-secret";
    session.region = region;
    session.isLoggedIn = true;
    await session.save();
    return redirect("/dashboard");
  }
    try {
      const stsClient = new STSClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Validate credentials using STS GetCallerIdentity
    await stsClient.send(new GetCallerIdentityCommand({}));

    // If valid, save to encrypted session
    const session = await getSession();
    session.accessKeyId = accessKeyId;
    session.secretAccessKey = secretAccessKey;
    session.region = region;
    session.isLoggedIn = true;
    await session.save();

  } catch (err: any) {
    return { error: err.message || "Failed to validate AWS credentials." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}

export async function demoLogin() {
  const session = await getSession();
  session.accessKeyId = "demo-key";
  session.secretAccessKey = "demo-secret";
  session.region = "ap-south-1";
  session.isLoggedIn = true;
  await session.save();

  const cookieStore = await cookies();
  cookieStore.set("cf_demo_mode", "true");

  redirect("/dashboard");
}
