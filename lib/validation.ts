import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(80),
  email: z.string().email("Enter a valid email"),
  subject: z.string().max(120).optional().or(z.literal("")),
  body: z.string().min(10, "Message is a bit short").max(4000),
  // honeypot — must stay empty
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
