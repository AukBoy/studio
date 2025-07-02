'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [adminUser, setAdminUser] = useLocalStorage<LoginFormValues | null>('tailor-track-admin', null);
  const [, setSession] = useLocalStorage('tailor-track-session', false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!adminUser) {
        setIsSignUp(true);
    }
  }, [adminUser]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    if (isSignUp) {
        // Sign up logic
        if (adminUser) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An admin account already exists.",
            });
        } else {
            setAdminUser(data);
            setSession(true);
            toast({
                title: "Account Created!",
                description: "Welcome! You have been logged in.",
            });
            router.replace('/dashboard');
        }
    } else {
        // Login logic
        if (adminUser && adminUser.email === data.email && adminUser.password === data.password) {
            setSession(true);
            router.replace('/dashboard');
        } else {
            toast({
                variant: "destructive",
                title: "Invalid Credentials",
                description: "Please check your email and password.",
            });
            form.resetField("password");
        }
    }
  };
  
  const title = isSignUp ? "Create Admin Account" : "Welcome Back";
  const description = isSignUp 
    ? "No admin account found. Please create one to get started." 
    : "Enter your credentials to access the dashboard.";
  const buttonText = isSignUp ? "Create Account & Enter" : "Enter Shop";
  const toggleText = isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up";


  if (!isMounted) {
      return (
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Loading...</CardTitle>
        </CardHeader>
      )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full">
            {buttonText}
          </Button>
          {!!adminUser && (
             <Button variant="link" size="sm" type="button" onClick={() => setIsSignUp(!isSignUp)}>
                {toggleText}
            </Button>
          )}
        </CardFooter>
      </form>
    </Form>
  );
}
