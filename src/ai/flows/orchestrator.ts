'use server';

/**
 * @fileOverview An AI orchestrator to route user requests to the correct agent.
 *
 * - orchestrate - A function that determines the user's intent and routes to the correct agent.
 */

import {ai} from '@/ai/genkit';
import { OrchestrateInputSchema, OrchestrateOutputSchema, type OrchestrateInput, type OrchestrateOutput } from './orchestrator-schemas';


export async function orchestrate(input: OrchestrateInput): Promise<OrchestrateOutput> {
  return orchestratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'orchestratorPrompt',
  input: {schema: OrchestrateInputSchema},
  output: {schema: OrchestrateOutputSchema},
  prompt: `You are an AI orchestrator for a farming assistance app called AgriAssist AI. Your job is to understand the user's request and determine which of the available agents can best handle it.

The available agents are:
- Crop Diagnosis: For identifying crop diseases and issues from images and descriptions.
- Weather Reports: For providing current weather and forecasts.
- Discussion Forums: For connecting with other farmers.
- Government Schemes: For finding information about government support programs.
- Farmer's Training: For accessing educational materials and training opportunities.
- Crop Management: For analyzing soil data and getting crop management advice.
- Financial Advice: For getting advice on loans, investments, and other financial matters.
- Market Prices: For viewing current market prices of crops.

Analyze the user's query: "{{{query}}}"

Based on the query, select the most appropriate agent. If the request is ambiguous or could be handled by multiple agents, select the most likely one. If the request is not related to any of the agents, select 'Unknown'.

You can also ask a clarifying question to the user to get more information. For example, if the user says "I need help with my finances", you could ask "What specific financial question do you have?".
`,
});

const orchestratorFlow = ai.defineFlow(
  {
    name: 'orchestratorFlow',
    inputSchema: OrchestrateInputSchema,
    outputSchema: OrchestrateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
