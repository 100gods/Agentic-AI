/**
 * @fileOverview Zod schemas and types for the AI orchestrator flow.
 *
 * - OrchestrateInputSchema - The Zod schema for the orchestrator input.
 * - OrchestrateInput - The type for the orchestrator input.
 * - OrchestrateOutputSchema - The Zod schema for the orchestrator output.
 * - OrchestrateOutput - The type for the orchestrator output.
 */

import {z} from 'genkit';

const agentNames = [
  'Crop Diagnosis',
  'Weather Reports',
  'Discussion Forums',
  'Government Schemes',
  'Farmer\'s Training',
  'Crop Management',
  'Financial Advice',
  'Market Prices',
  'Unknown',
] as const;

export const OrchestrateInputSchema = z.object({
  query: z.string().describe('The user\'s request in text or voice.'),
});
export type OrchestrateInput = z.infer<typeof OrchestrateInputSchema>;

export const OrchestrateOutputSchema = z.object({
  agent: z.enum(agentNames).describe('The agent that can best handle the user\'s request.'),
  clarifyingQuestion: z.string().optional().describe('A question to ask the user to gather more information if needed. For example, if the user asks for financial advice, you could ask for their location or experience level.'),
});
export type OrchestrateOutput = z.infer<typeof OrchestrateOutputSchema>;
