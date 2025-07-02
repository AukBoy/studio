import { LoginForm } from '@/components/login-form';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-5xl font-headline font-bold text-primary">TailorTrack</h1>
            <p className="text-muted-foreground mt-2 font-body">Your Digital Tailoring Assistant</p>
        </div>
        <Card className="shadow-lg">
            <LoginForm />
        </Card>
      </div>
    </main>
  );
}
