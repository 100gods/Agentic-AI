'use server';

/**
 * @fileOverview A financial advice AI agent for farmers.
 *
 * - getFinancialAdvice - A function that provides financial advice.
 * - GetFinancialAdviceInput - The input type for the getFinancialAdvice function.
 * - GetFinancialAdviceOutput - The return type for the getFinancialAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetFinancialAdviceInputSchema = z.object({
  query: z.string().describe('The farmer\'s question about financial matters.'),
  profile: z.object({
    location: z.string().optional(),
    experience: z.string().optional(),
    farmingType: z.string().optional(),
    landSize: z.string().optional(),
    investmentInterest: z.boolean().optional(),
  }).describe('The farmer\'s profile information.'),
});

export type GetFinancialAdviceInput = z.infer<typeof GetFinancialAdviceInputSchema>;

const GetFinancialAdviceOutputSchema = z.object({
  advice: z.string().describe('The generated financial advice.'),
  opportunities: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).describe('A list of potential financial opportunities.'),
});

export type GetFinancialAdviceOutput = z.infer<typeof GetFinancialAdviceOutputSchema>;

export async function getFinancialAdvice(input: GetFinancialAdviceInput): Promise<GetFinancialAdviceOutput> {
  return financialAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialAdvicePrompt',
  input: {schema: GetFinancialAdviceInputSchema},
  output: {schema: GetFinancialAdviceOutputSchema},
  prompt: `You are an expert financial advisor for farmers.

A farmer has the following profile:
- Location: {{{profile.location}}}
- Experience: {{{profile.experience}}}
- Farming Type: {{{profile.farmingType}}}
- Land Size: {{{profile.landSize}}}
- Interested in Investment: {{{profile.investmentInterest}}}

The farmer's query is: "{{{query}}}"

Based on their profile and query, provide clear, actionable financial advice. 
Also, identify and list relevant financial opportunities, such as government schemes, loans, or investment options.
Respond in a helpful and encouraging tone.
`,
});

const financialAdviceFlow = ai.defineFlow(
  {
    name: 'financialAdviceFlow',
    inputSchema: GetFinancialAdviceInputSchema,
    outputSchema: GetFinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
