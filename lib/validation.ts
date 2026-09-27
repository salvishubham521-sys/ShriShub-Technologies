import { z } from "zod";

export const requirementSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
  country: z.string().min(2).max(80),
  company: z.string().max(160).optional(),
  communication: z.enum(["email", "whatsapp", "dashboard"]),
  projectName: z.string().min(2).max(160),
  purpose: z.string().min(10).max(3000),
  pages: z.string().max(3000).optional(),
  features: z.string().max(5000).optional(),
  design: z.string().max(3000).optional(),
  references: z.string().max(3000).optional(),
  contentReady: z.boolean(),
  domainStatus: z.enum(["have-domain", "need-domain", "unsure"]),
  specialRequirements: z.string().max(5000).optional(),
});
