// src/ai/flows/summarize-content.ts
'use server';

/**
 * @fileOverview A content summarization AI agent.
 *
 * - summarizeContent - A function that handles the content summarization process.
 * - SummarizeContentInput - The input type for the summarizeContent function.
 * - SummarizeContentOutput - The return type for the summarizeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeContentInputSchema = z.object({
  content: z.string().describe('The content to be summarized.'),
});
export type SummarizeContentInput = z.infer<typeof SummarizeContentInputSchema>;

const SummarizeContentOutputSchema = z.object({
  summary: z.string().describe('The summarized content.'),
  needsSummary: z.boolean().describe('Whether the content needs to be summarized or not.')
});
export type SummarizeContentOutput = z.infer<typeof SummarizeContentOutputSchema>;

export async function summarizeContent(input: SummarizeContentInput): Promise<SummarizeContentOutput> {
  return summarizeContentFlow(input);
}

const shouldSummarizeTool = ai.defineTool({
  name: 'shouldSummarize',
  description: 'Determines whether the given content needs to be summarized.',
  inputSchema: z.object({
    content: z.string().describe('The content to be checked.')
  }),
  outputSchema: z.boolean(),
  async execute(input) {
    // Basic logic to decide if content should be summarized
    // For example, if the content is longer than 150 words, it should be summarized.
    const wordCount = input.content.trim().split(/\s+/).length;
    return wordCount > 150;
  }
});

const summarizeContentPrompt = ai.definePrompt({
  name: 'summarizeContentPrompt',
  input: {schema: SummarizeContentInputSchema},
  output: {schema: SummarizeContentOutputSchema},
  tools: [shouldSummarizeTool],
  prompt: `You are an expert content summarizer. Your goal is to provide a concise and informative summary of the given content.

  First, use the shouldSummarize tool to determine if the content needs to be summarized.
  If it does not need to be summarized, return the original content as the summary.
  If it needs to be summarized, provide a summary of the content that captures the main points and key information.

  Content: {{{content}}}`,
});

const summarizeContentFlow = ai.defineFlow(
  {
    name: 'summarizeContentFlow',
    inputSchema: SummarizeContentInputSchema,
    outputSchema: SummarizeContentOutputSchema,
  },
  async input => {
    const shouldSummarize = await shouldSummarizeTool(input);

    if (!shouldSummarize) {
      return {
        summary: input.content,
        needsSummary: false
      };
    }

    const {output} = await summarizeContentPrompt(input);
    return {
      summary: output!.summary,
      needsSummary: true
    };
  }
);
