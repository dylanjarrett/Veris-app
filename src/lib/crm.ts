// src/lib/crm.ts

export type CRMRecordType = "listing" | "seller" | "buyer" | "general";

export interface PushToCRMInput {
  raw: string;        // original notes / prompt
  processed: string;  // AI output
  type: CRMRecordType | string;
}

/**
 * Client-side helper to save an AI result into the CRM.
 * Called from the Intelligence page (Core engine / Seller Studio / Buyer Studio).
 */
export async function pushToCRM(input: PushToCRMInput) {
  const res = await fetch("/api/crm/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    let message = "Failed to save to CRM.";
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore JSON parse error, keep generic message
    }
    throw new Error(message);
  }

  return res.json(); // { success: true, record: ... }
}

