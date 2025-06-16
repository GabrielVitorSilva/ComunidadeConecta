// src/app/(auth)/login/page.tsx
import LoginForm from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Entrar</CardTitle>
          <CardDescription>Acesse sua conta na Comunidade Conecta.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Button variant="link" className="p-0 h-auto font-semibold text-primary" asChild>
              <Link href="/register">Registre-se aqui</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
