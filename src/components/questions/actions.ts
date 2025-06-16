// src/components/questions/actions.ts
"use server";

import * as z from "zod";
import { createQuestion, createAnswer as createAnswerData } from '@/lib/data';
import type { Question, Answer } from '@/types';
import { revalidatePath } from "next/cache";

// Schemas for validation
const questionSchema = z.object({
  title: z.string().min(10).max(150),
  description: z.string().min(30).max(5000),
  authorId: z.string(),
  attachmentsInput: z.string().optional(),
});

const answerSchema = z.object({
  questionId: z.string(),
  content: z.string().min(10).max(5000),
  authorId: z.string(),
  attachmentsInput: z.string().optional(),
});


interface ActionResult<T> {
  success: boolean;
  question?: T extends Question ? Question : never; // Conditional type for question
  answer?: T extends Answer ? Answer : never; // Conditional type for answer
  error?: string;
}

export async function createNewQuestion(
  values: z.infer<typeof questionSchema>
): Promise<ActionResult<Question>> {
  try {
    const validatedFields = questionSchema.safeParse(values);
    if (!validatedFields.success) {
      return { success: false, error: "Dados da pergunta inválidos." };
    }

    const newQuestion = await createQuestion(validatedFields.data);
    revalidatePath("/questions"); // Revalidate the list page
    revalidatePath(`/questions/${newQuestion.id}`); // Revalidate the new question page if accessed immediately
    return { success: true, question: newQuestion };

  } catch (error) {
    console.error("Error creating question:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    return { success: false, error: `Falha ao criar pergunta: ${errorMessage}` };
  }
}


export async function createNewAnswer(
  values: z.infer<typeof answerSchema>
): Promise<ActionResult<Answer>> {
   try {
    const validatedFields = answerSchema.safeParse(values);
    if (!validatedFields.success) {
      return { success: false, error: "Dados da resposta inválidos." };
    }

    const newAnswer = await createAnswerData(validatedFields.data);
    revalidatePath(`/questions/${values.questionId}`); // Revalidate the question detail page
    return { success: true, answer: newAnswer };

  } catch (error) {
    console.error("Error creating answer:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    return { success: false, error: `Falha ao criar resposta: ${errorMessage}` };
  }
}

// Server action for AI summarization
export async function getAISummary(content: string): Promise<{ summary: string; needsSummary: boolean; error?: string }> {
  try {
    const { summarizeContent: genAISummarize } = await import('@/ai/flows/summarize-content');
    const result = await genAISummarize({ content });
    return result;
  } catch (error) {
    console.error("AI Summarization error:", error);
    return { summary: content, needsSummary: false, error: "Falha ao gerar resumo." };
  }
}

