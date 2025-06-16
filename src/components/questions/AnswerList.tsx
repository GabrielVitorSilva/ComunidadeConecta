// src/components/questions/AnswerList.tsx
import type { Answer } from '@/types';
import AnswerListItem from './AnswerListItem';

interface AnswerListProps {
  answers: Answer[];
}

export default function AnswerList({ answers }: AnswerListProps) {
  if (!answers || answers.length === 0) {
    return <p className="text-center text-muted-foreground py-6">Ainda não há respostas para esta pergunta. Seja o primeiro!</p>;
  }

  return (
    <div className="space-y-8">
      {answers.map((answer) => (
        <AnswerListItem key={answer.id} answer={answer} />
      ))}
    </div>
  );
}
