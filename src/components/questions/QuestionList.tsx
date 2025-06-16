// src/components/questions/QuestionList.tsx
import type { Question } from '@/types';
import QuestionListItem from './QuestionListItem';

interface QuestionListProps {
  questions: Question[];
}

export default function QuestionList({ questions }: QuestionListProps) {
  if (!questions || questions.length === 0) {
    return <p className="text-center text-muted-foreground py-10">Nenhuma pergunta encontrada.</p>;
  }

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <QuestionListItem key={question.id} question={question} />
      ))}
    </div>
  );
}
