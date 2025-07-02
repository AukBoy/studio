'use client';

import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import React from 'react';

export function LoginForm() {
  const [, setAuthenticated] = useLocalStorage('tailor-track-auth', false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticated(true);
    router.replace('/dashboard');
  };

  return (
    <form onSubmit={handleLogin}>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Welcome</CardTitle>
            <CardDescription>Enter your email to access the dashboard. For this demo, any email will work.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required className="font-body"/>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Enter Shop
          </Button>
        </CardFooter>
      </form>
  );
}
