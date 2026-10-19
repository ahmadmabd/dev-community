import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().trim().min(5).max(200),
  content: z.string().trim().min(10),
  topics: z.array(z.string().trim().min(1).max(50)).default([]),
});
