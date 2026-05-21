import { z } from "zod";

export const leadSchema = z.object({
  nome: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  placa: z.string().trim().min(7).max(8),
});

export type LeadInput = z.infer<typeof leadSchema>;

export async function submitLead(data: LeadInput): Promise<{ ok: boolean }> {
  const response = await fetch("/.netlify/functions/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: "Network error" }));
    throw new Error(payload.error ?? "Submission failed");
  }

  return response.json();
}
