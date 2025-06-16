// src/components/questions/QuestionForm.tsx
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createNewQuestion } from "./actions"; // Server action
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(10, { message: "O título deve ter pelo menos 10 caracteres." }).max(150, { message: "O título não pode exceder 150 caracteres." }),
  description: z.string().min(30, { message: "A descrição deve ter pelo menos 30 caracteres." }).max(5000, { message: "A descrição não pode exceder 5000 caracteres." }),
  attachmentsInput: z.string().optional().describe("Nomes dos arquivos separados por vírgula"),
});

export default function QuestionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      attachmentsInput: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Erro de autenticação", description: "Você precisa estar logado para postar uma pergunta." });
      router.push('/login');
      return;
    }
    setIsLoading(true);
    const result = await createNewQuestion({ ...values, authorId: currentUser.id });
    setIsLoading(false);

    if (result.success && result.question) {
      toast({
        title: "Pergunta postada!",
        description: "Sua pergunta foi publicada com sucesso.",
      });
      router.push(`/questions/${result.question.id}`);
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao postar pergunta",
        description: result.error || "Não foi possível postar sua pergunta. Tente novamente.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Título da Pergunta</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Como configurar X com Y no Next.js?" {...field} />
              </FormControl>
              <FormDescription>
                Seja específico e imagine que está perguntando a outra pessoa.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Descrição Detalhada</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva seu problema em detalhes. Inclua o que você já tentou e o que espera alcançar."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
               <FormDescription>
                Use formatação Markdown para clareza, se desejar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="attachmentsInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Anexos (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: log.txt, captura_tela.png" {...field} />
              </FormControl>
              <FormDescription>
                Liste os nomes dos arquivos separados por vírgula. (Simulação, sem upload real)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto" size="lg" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Publicar Pergunta
        </Button>
      </form>
    </Form>
  );
}
