'use server';

/**
 * @fileOverview A general purpose chat flow.
 *
 * - chat - A function that handles a user's chat query.
 */

import {ai} from '@/ai/genkit';
import { ChatInputSchema, ChatOutputSchema, type ChatInput, type ChatOutput } from './chat-schemas';


export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are a helpful assistant for the Pratham Kishan app, a farming assistance application.

Answer the user's query: "{{{query}}}"

Provide a helpful and concise response. If the query is about a feature in the app, you can suggest they use it. The available features are: Crop Diagnosis, Weather Reports, Discussion Forums, Government Schemes, Farmer's Training, Crop Management, Financial Advice, and Market Prices.
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
