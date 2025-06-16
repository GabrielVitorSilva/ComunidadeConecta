// src/components/shared/SummarizeButton.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getAISummary } from '@/components/questions/actions'; // Server action
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface SummarizeButtonProps {
  contentToSummarize: string;
  buttonText?: string;
}

export default function SummarizeButton({ contentToSummarize, buttonText = "Ver Resumo por IA" }: SummarizeButtonProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [needsSummaryFlag, setNeedsSummaryFlag] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleSummarize = async () => {
    if (summary) { // If summary already fetched, just toggle visibility
      setShowSummary(!showSummary);
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowSummary(true); // Show loading/summary area immediately

    try {
      const result = await getAISummary(contentToSummarize);
      if (result.error) {
        setError(result.error);
        setSummary(contentToSummarize); // Fallback to original content on error
        setNeedsSummaryFlag(false);
      } else {
        setSummary(result.summary);
        setNeedsSummaryFlag(result.needsSummary);
      }
    } catch (e) {
      setError("Ocorreu um erro inesperado ao buscar o resumo.");
      setSummary(contentToSummarize); // Fallback
      setNeedsSummaryFlag(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Button onClick={handleSummarize} variant="outline" size="sm" disabled={isLoading} aria-expanded={showSummary}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4 text-accent" />
        )}
        {showSummary && summary ? "Esconder Resumo" : buttonText}
      </Button>

      {showSummary && (
        <Card className="mt-4 border-primary/50 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              {isLoading ? "Gerando Resumo..." : "Resumo do Conteúdo"}
              {!isLoading && needsSummaryFlag && <Badge variant="default" className="ml-2 bg-primary/80 text-primary-foreground">IA</Badge>}
              {!isLoading && !needsSummaryFlag && !error && <Badge variant="secondary" className="ml-2">Conteúdo Conciso</Badge>}
            </CardTitle>
            {!isLoading && error && (
              <CardDescription className="text-destructive flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> {error}
              </CardDescription>
            )}
             {!isLoading && !error && !needsSummaryFlag && (
              <CardDescription className="text-muted-foreground flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" /> Este conteúdo já é conciso e não necessitou de resumo por IA.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
              </div>
            ) : (
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{summary}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
