"use server";

import { getIdleEC2Instances } from "./compute";
import { getUnusedEIPs } from "./network";
import { getStorageOpportunities } from "./storage";
import { cookies } from "next/headers";

export async function getAggregatedInsights() {
  const [compute, network, storage] = await Promise.all([
    getIdleEC2Instances(),
    getUnusedEIPs(),
    getStorageOpportunities(),
  ]);

  const cookieStore = await cookies();
  const isDemo = cookieStore.get("cf_demo_mode")?.value === "true";
  if (isDemo) {
    // Artificial delay to make it feel real
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  const allItems = [
    ...(compute.data || []),
    ...(network.data || []),
    ...(storage.data || []),
  ];

  let totalWaste = 0;
  allItems.forEach(item => {
    totalWaste += item.monthlyLeakage;
  });

  // Calculate optimization score
  const optimizationScore = Math.floor(Math.max(0, 100 - (totalWaste / 500)));

  return {
    totalWaste,
    optimizationScore,
    issuesCount: allItems.length,
    issues: allItems,
    errors: [compute.error, network.error, ...(storage.errors || [])].filter(Boolean)
  };
}
