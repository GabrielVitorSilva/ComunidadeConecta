// src/app/(main)/questions/[id]/page.tsx
import { getQuestionById } from '@/lib/data';
import QuestionDetail from '@/components/questions/QuestionDetail';
import AnswerForm from '@/components/questions/AnswerForm';
import AnswerList from '@/components/questions/AnswerList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, MessageSquareWarning } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function QuestionData({ id }: { id: string }) {
  const question = await getQuestionById(id);

  if (!question) {
    return (
      <div className="text-center py-20">
        <MessageSquareWarning className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Pergunta não encontrada</h2>
        <p className="text-muted-foreground mb-6">A pergunta que você está procurando não existe ou foi removida.</p>
        <Button asChild>
          <Link href="/questions">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Perguntas
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <QuestionDetail question={question} />
      <div className="my-12">
        <h2 className="text-3xl font-bold font-headline mb-6">Respostas ({question.answers.length})</h2>
        <AnswerList answers={question.answers} />
      </div>
      <div className="my-12">
         <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Sua Resposta</CardTitle>
                <CardDescription>Compartilhe sua solução ou perspectiva sobre esta pergunta.</CardDescription>
            </CardHeader>
            <CardContent>
                <AnswerForm questionId={question.id} />
            </CardContent>
        </Card>
      </div>
    </>
  );
}

function QuestionDetailSkeleton() {
  return (
    <div className="space-y-10">
      {/* Question Detail Skeleton */}
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-10 w-3/4 mb-4" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-3/4" />
          <div className="mt-4">
            <Skeleton className="h-6 w-40 mb-2" /> {/* Attachments heading */}
            <Skeleton className="h-5 w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Answer List Skeleton */}
      <div>
        <Skeleton className="h-8 w-48 mb-6" /> {/* "Respostas" heading */}
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="mb-6 shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Answer Form Skeleton */}
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-7 w-1/3 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-1/4" />
        </CardContent>
      </Card>
    </div>
  );
}


export default function QuestionPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button variant="outline" asChild className="mb-8">
        <Link href="/questions">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para todas as perguntas
        </Link>
      </Button>
      <Suspense fallback={<QuestionDetailSkeleton />}>
        <QuestionData id={params.id} />
      </Suspense>
    </div>
  );
}
