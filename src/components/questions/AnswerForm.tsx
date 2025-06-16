// src/components/questions/AnswerForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createNewAnswer } from "./actions"; // Server action
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  content: z.string().min(10, { message: "A resposta deve ter pelo menos 10 caracteres." }).max(5000, { message: "A resposta não pode exceder 5000 caracteres." }),
  attachmentsInput: z.string().optional().describe("Nomes dos arquivos separados por vírgula"),
});

interface AnswerFormProps {
  questionId: string;
}

export default function AnswerForm({ questionId }: AnswerFormProps) {
  const { toast } = useToast();
  const router = useRouter(); // To refresh data or navigate
  const { currentUser, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      attachmentsInput: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Erro de autenticação", description: "Você precisa estar logado para responder." });
      router.push(`/login?redirect=/questions/${questionId}`);
      return;
    }
    setIsSubmitting(true);
    const result = await createNewAnswer({ ...values, questionId, authorId: currentUser.id });
    setIsSubmitting(false);

    if (result.success && result.answer) {
      toast({
        title: "Resposta enviada!",
        description: "Sua resposta foi publicada com sucesso.",
      });
      form.reset(); // Clear the form
      // router.refresh(); // Could refresh to show new answer, or rely on revalidatePath from action
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao enviar resposta",
        description: result.error || "Não foi possível enviar sua resposta. Tente novamente.",
      });
    }
  }

  if (authLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!currentUser) {
    return (
      <div className="text-center py-6 border-t">
        <p className="text-muted-foreground">Você precisa estar <Button variant="link" className="p-0 h-auto" asChild><Link href={`/login?redirect=/questions/${questionId}`}>logado</Link></Button> para responder a esta pergunta.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg sr-only">Sua Resposta</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite sua resposta aqui..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="attachmentsInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Anexos (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: referencia.pdf, exemplo.js" {...field} />
              </FormControl>
              <FormDescription>
                Liste os nomes dos arquivos separados por vírgula. (Simulação)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar Resposta
        </Button>
      </form>
    </Form>
  );
}
