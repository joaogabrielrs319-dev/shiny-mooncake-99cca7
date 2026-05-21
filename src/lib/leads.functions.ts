import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const leadSchema = z.object({
  nome: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  placa: z.string().trim().min(7).max(8),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("leads").insert({
      nome: data.nome,
      email: data.email && data.email.length > 0 ? data.email : null,
      placa: data.placa,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
