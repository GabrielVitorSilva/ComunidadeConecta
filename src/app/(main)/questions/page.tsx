// src/app/(main)/questions/page.tsx
import { getQuestions } from '@/lib/data';
import QuestionList from '@/components/questions/QuestionList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function QuestionsListData() {
  const questions = await getQuestions();
  return <QuestionList questions={questions} />;
}

function QuestionListSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 bg-card rounded-lg shadow-md">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div className="flex justify-between items-center mt-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}


export default async function QuestionsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Perguntas Recentes</h1>
        {/* This button will be visible based on auth state handled in AppHeader,
            but providing a direct link here is also good UX.
            For a more robust solution, this could be a client component checking auth.
        */}
        <Button asChild variant="accent">
          <Link href="/questions/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nova Pergunta
          </Link>
        </Button>
      </div>
      <Suspense fallback={<QuestionListSkeleton />}>
        <QuestionsListData />
      </Suspense>
    </div>
  );
}
