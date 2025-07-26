'use server';

/**
 * @fileOverview Crop diagnosis AI agent.
 *
 * - diagnoseCrop - A function that handles the crop diagnosis process.
 * - DiagnoseCropInput - The input type for the diagnoseCrop function.
 * - DiagnoseCropOutput - The return type for the diagnoseCrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCropInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the crop issue in local language.'),
  language: z.string().describe('The language of the description.'),
});
export type DiagnoseCropInput = z.infer<typeof DiagnoseCropInputSchema>;

const DiagnoseCropOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the crop issue.'),
  solutions: z.string().describe('Suggested solutions for the crop issue.'),
});
export type DiagnoseCropOutput = z.infer<typeof DiagnoseCropOutputSchema>;

export async function diagnoseCrop(input: DiagnoseCropInput): Promise<DiagnoseCropOutput> {
  return diagnoseCropFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseCropPrompt',
  input: {schema: DiagnoseCropInputSchema},
  output: {schema: DiagnoseCropOutputSchema},
  prompt: `You are an expert agricultural advisor specializing in diagnosing crop illnesses and issues.

You will use the following information to diagnose the crop and its issues, and suggest solutions.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Respond in the same language as the description: {{{language}}}.

Provide a detailed diagnosis of the issue and suggest practical solutions for the farmer to implement.
`,
});

const diagnoseCropFlow = ai.defineFlow(
  {
    name: 'diagnoseCropFlow',
    inputSchema: DiagnoseCropInputSchema,
    outputSchema: DiagnoseCropOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
