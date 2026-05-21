import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const leadSchema = z.object({
  nome: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  placa: z.string().trim().min(7).max(8),
});

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const data = leadSchema.parse(body);

    const supabaseUrl = Netlify.env.get("SUPABASE_URL");
    const serviceRoleKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return Response.json({ error: "Server configuration error" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from("leads").insert({
      nome: data.nome,
      email: data.email && data.email.length > 0 ? data.email : null,
      placa: data.placa,
    });

    if (error) throw new Error(error.message);
    return Response.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof z.ZodError
        ? (err.errors[0]?.message ?? "Validation error")
        : err instanceof Error
          ? err.message
          : "Unknown error";
    return Response.json({ error: message }, { status: 400 });
  }
};
