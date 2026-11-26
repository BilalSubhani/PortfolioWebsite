import { z } from 'zod';

export const PURPOSES = ['Employment', 'Freelance', 'Collaboration', 'Other'] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100, 'That name is a bit long'),
  email: z.string().trim().email('Please enter a valid email').max(200),
  purpose: z.enum(PURPOSES, { message: 'Pick what this is about' }),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  budget: z.string().trim().max(60).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Tell me a little more (10+ characters)').max(4000, 'Please keep it under 4,000 characters'),
});

export type ContactValues = z.infer<typeof contactSchema>;
