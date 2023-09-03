import { z } from "zod";

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
});

export type Company = z.infer<typeof companySchema>;
