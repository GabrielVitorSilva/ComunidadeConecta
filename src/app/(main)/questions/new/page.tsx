// src/app/(main)/questions/new/page.tsx
"use client"; 

import QuestionForm from '@/components/questions/QuestionForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewQuestionPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace('/login?redirect=/questions/new');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
       <div className="max-w-3xl mx-auto py-10">
        <Card className="shadow-xl">
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/4 ml-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser) {
    // This case should ideally be handled by the redirect,
    // but as a fallback or if redirect hasn't completed.
    return (
      <div className="text-center py-10">
        <p>Você precisa estar logado para postar uma nova pergunta.</p>
        <Button onClick={() => router.push('/login?redirect=/questions/new')} className="mt-4">
          Ir para Login
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Faça uma Nova Pergunta</CardTitle>
          <CardDescription>Compartilhe sua dúvida com a comunidade. Descreva seu problema com clareza para obter as melhores respostas.</CardDescription>
        </CardHeader>
        <CardContent>
          <QuestionForm />
        </CardContent>
      </Card>
    </div>
  );
}
