// src/components/questions/QuestionDetail.tsx
"use client";

import type { Question } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Paperclip, UserCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SummarizeButton from '@/components/shared/SummarizeButton';

interface QuestionDetailProps {
  question: Question;
}

export default function QuestionDetail({ question }: QuestionDetailProps) {
  const getInitials = (name: string | undefined) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-primary leading-tight">{question.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={question.authorAvatarUrl} alt={question.authorName} data-ai-hint="user avatar" />
              <AvatarFallback>{getInitials(question.authorName)}</AvatarFallback>
            </Avatar>
            <span>Por: <span className="font-medium text-foreground">{question.authorName}</span></span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            <span>Publicado em: <span className="font-medium text-foreground">{format(new Date(question.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</span></span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-lg max-w-none text-foreground/90 whitespace-pre-wrap">
          {question.description}
        </div>
        {question.description.length > 150 && ( // Only show summarize button for longer descriptions
          <div className="mt-6">
            <SummarizeButton contentToSummarize={question.description} buttonText="Resumir Descrição" />
          </div>
        )}
      </CardContent>
      {question.attachments && question.attachments.length > 0 && (
        <CardFooter className="flex-col items-start gap-2 border-t pt-6">
          <h3 className="text-md font-semibold flex items-center"><Paperclip className="h-5 w-5 mr-2 text-primary" /> Anexos:</h3>
          <ul className="list-none pl-0 space-y-1">
            {question.attachments.map(att => (
              <li key={att.id}>
                <a href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                  {att.fileName} ({att.fileType})
                </a>
              </li>
            ))}
          </ul>
        </CardFooter>
      )}
    </Card>
  );
}
