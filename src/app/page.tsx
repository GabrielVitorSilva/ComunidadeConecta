import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageCircleQuestion, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12">
      <section className="mt-10">
        <h1 className="text-5xl font-bold font-headline tracking-tight text-primary">
          Bem-vindo à Comunidade Conecta!
        </h1>
        <p className="mt-4 text-xl text-foreground/80 max-w-2xl mx-auto">
          Seu espaço para tirar dúvidas, compartilhar conhecimento e conectar-se com outros apaixonados por tecnologia e desenvolvimento.
        </p>
        <Button size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
          <Link href="/questions">Explorar Perguntas</Link>
        </Button>
      </section>

      <section className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
        <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircleQuestion className="mr-3 h-7 w-7 text-primary" />
              Pergunte e Aprenda
            </CardTitle>
            <CardDescription>
              Não encontrou uma resposta? Publique sua pergunta e deixe a comunidade ajudar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Detalhe seu problema, adicione contexto e veja as soluções surgirem.</p>
          </CardContent>
        </Card>
        <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-3 h-7 w-7 text-primary" />
              Conecte-se
            </CardTitle>
            <CardDescription>
              Interaja com outros membros, responda perguntas e construa sua reputação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Compartilhe sua expertise e ajude a construir uma base de conhecimento colaborativa.</p>
          </CardContent>
        </Card>
        <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-3 h-7 w-7 text-primary" />
              Resumos Inteligentes
            </CardTitle>
            <CardDescription>
             Conteúdo longo? Obtenha resumos rápidos e precisos com nossa IA integrada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Nossa tecnologia GenAI ajuda você a focar no que realmente importa.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
