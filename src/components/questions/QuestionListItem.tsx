// src/components/questions/QuestionListItem.tsx
import type { Question } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, CalendarDays, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface QuestionListItemProps {
  question: Question;
}

export default function QuestionListItem({ question }: QuestionListItemProps) {
  const getInitials = (name: string | undefined) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <Link href={`/questions/${question.id}`} className="hover:underline">
          <CardTitle className="text-2xl font-headline text-primary">{question.title}</CardTitle>
        </Link>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={question.authorAvatarUrl} alt={question.authorName} data-ai-hint="user avatar" />
              <AvatarFallback>{getInitials(question.authorName)}</AvatarFallback>
            </Avatar>
            <span>{question.authorName}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale: ptBR })}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{question.answers?.length || 0} respostas</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 line-clamp-3">
          {question.summaryText || question.description}
        </p>
        {question.summaryNeeded && (
          <span className="text-xs text-accent-foreground bg-accent/20 px-2 py-0.5 rounded-full inline-flex items-center mt-2">
            <Tag className="h-3 w-3 mr-1" /> Resumo por IA
          </span>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button asChild variant="outline">
          <Link href={`/questions/${question.id}`}>Ver Pergunta Completa</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
