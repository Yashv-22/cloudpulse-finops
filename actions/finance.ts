"use server";

export async function getExchangeRate() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    const data = await res.json();
    if (data && data.rates && data.rates.INR) {
      return Number(data.rates.INR.toFixed(2));
    }
    return 83.5; // Safe fallback
  } catch (error) {
    console.error("Failed to fetch exchange rate", error);
    return 83.5; // Safe fallback
  }
}
