import { z } from "zod";

export const Tool = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
}).passthrough();

export const TeamMember = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
}).passthrough();

export const Publication = z.object({
  title: z.string().min(1),
  year: z.string().min(1),
}).passthrough();

export const ToolsPayload = z.array(Tool);
export const TeamPayload = z.array(TeamMember);
export const PublicationsPayload = z.array(Publication);
