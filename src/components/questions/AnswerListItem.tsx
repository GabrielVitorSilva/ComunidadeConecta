// src/components/questions/AnswerListItem.tsx
"use client";

import type { Answer } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Paperclip } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SummarizeButton from '@/components/shared/SummarizeButton';

interface AnswerListItemProps {
  answer: Answer;
}

export default function AnswerListItem({ answer }: AnswerListItemProps) {
  const getInitials = (name: string | undefined) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="bg-card/80 shadow-md">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={answer.authorAvatarUrl} alt={answer.authorName} data-ai-hint="user avatar" />
            <AvatarFallback>{getInitials(answer.authorName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">{answer.authorName}</p>
            <p className="text-xs text-muted-foreground flex items-center">
              <CalendarDays className="h-3 w-3 mr-1" />
              {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true, locale: ptBR })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none text-foreground/90 whitespace-pre-wrap">
          {answer.content}
        </div>
         {answer.content.length > 150 && ( // Only show summarize button for longer content
          <div className="mt-4">
             <SummarizeButton contentToSummarize={answer.content} buttonText="Resumir Resposta" />
          </div>
        )}
      </CardContent>
      {answer.attachments && answer.attachments.length > 0 && (
        <CardFooter className="flex-col items-start gap-1 border-t pt-4 mt-4">
          <h4 className="text-xs font-semibold flex items-center text-muted-foreground"><Paperclip className="h-4 w-4 mr-1" /> Anexos:</h4>
          <ul className="list-none pl-0 space-y-0.5">
            {answer.attachments.map(att => (
              <li key={att.id}>
                <a href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                  {att.fileName}
                </a>
              </li>
            ))}
          </ul>
        </CardFooter>
      )}
    </Card>
  );
}
