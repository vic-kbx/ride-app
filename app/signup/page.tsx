"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email || !password) {
      setMessage("Please complete all fields.");
      return;
    }
    setMessage("Account created. You can now login.");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-muted/40 px-4 py-8 sm:py-12">
      <section className="w-full max-w-md">
        <Card className="py-0">
          <CardHeader className="gap-1 border-b py-6">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Sign up to start booking rides.</CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="•••••••"
                />
              </div>
              {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t py-4 text-sm text-muted-foreground">
            Already have an account?&nbsp;
            <Button variant="link" className="h-auto p-0" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
