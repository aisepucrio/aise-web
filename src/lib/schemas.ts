import { z } from "zod";

// Schema para Tool
export const Tool = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
}).passthrough();

// Schema para TeamMember
export const TeamMember = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
}).passthrough();

// Schema para Publication
export const Publication = z.object({
  title: z.string().min(1),
  year: z.number().int(),
}).passthrough();

// Payloads (arrays)
export const ToolsPayload = z.array(Tool);
export const TeamPayload = z.array(TeamMember);
export const PublicationsPayload = z.array(Publication);
