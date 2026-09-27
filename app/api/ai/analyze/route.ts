import { NextResponse } from "next/server";
import { z } from "zod";
import { services } from "@/lib/config";

const schema = z.object({ description: z.string().min(3), service: z.string().optional(), requirements: z.record(z.string(), z.any()).optional(), mode: z.string().optional() });

function fallback(description: string, requested?: string) {
  const lower = description.toLowerCase();
  const category =
    requested && services.some(s=>s.slug===requested) ? requested :
    /hotel|resort|room/.test(lower) ? "hotel" :
    /college|school|university|student portal/.test(lower) ? "college" :
    /portfolio|resume|profile/.test(lower) ? "portfolio" :
    /shop|store|ecommerce|e-commerce/.test(lower) ? "business" :
    /dashboard|saas|platform|booking|app/.test(lower) ? "custom" : "project";
  const item = services.find(s=>s.slug===category) || services[0];
  return {
    category: item.name,
    complexity: category === "custom" ? "High" : "Medium",
    summary: `Based on the description, ${item.name} is a reasonable starting category. The administrator should confirm the final scope, price and delivery commitment.`,
    features: item.features,
    questions: ["Who are the primary users?", "What must the first release do?", "Do you need login, payments or an admin dashboard?"],
    suggestedTechnology: ["Next.js", "PostgreSQL", "Managed authentication", "Cloud object storage"],
    price: item.price,
    timeline: item.delivery,
  };
}

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  // Provider-agnostic by design. Put the actual AI call here, server-side, after
  // selecting a model/provider and storing admin-approved knowledge in the DB.
  // Never let model output directly change prices or contract terms.
  const analysis = fallback(body.description, body.service);
  const reply = body.mode === "chat"
    ? `I’d start with ${analysis.category}. Key things to clarify are: ${analysis.questions.join(" ")}`
    : undefined;
  return NextResponse.json({ analysis, reply });
}
