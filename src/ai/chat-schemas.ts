/**
 * @fileOverview Zod schemas and types for the AI chat flow.
 *
 * - ChatInputSchema - The Zod schema for the chat input.
 * - ChatInput - The type for the chat input.
 * - ChatOutputSchema - The Zod schema for the chat output.
 * - ChatOutput - The type for the chat output.
 */

import {z} from 'genkit';

export const ChatInputSchema = z.object({
    query: z.string().describe("The user's message."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;
  
export const ChatOutputSchema = z.object({
    response: z.string().describe("The AI's response to the user's message."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
