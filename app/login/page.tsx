"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
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

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, user, login } = useAuth();

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    router.replace(user.role === "motorider" ? "/motorider/dashboard" : "/book");
  }, [isAuthenticated, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!account || !password) {
        setError("Please enter both account and password.");
        return;
      }

      const result = await login(account, password);
      if (!result.success) {
        setError(result.error ?? "Invalid credentials.");
        return;
      }

      router.push(result.role === "motorider" ? "/motorider/dashboard" : "/book");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-muted/40 px-4 py-8 sm:py-12">
      <section className="w-full max-w-md">
        <Card className="py-0">
          <CardHeader className="gap-1 border-b py-6">
            <CardTitle className="text-2xl">GreenRide</CardTitle>
            <CardDescription>Log in to book your next ride.</CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="account" className="text-sm font-medium">
                  Account
                </label>
                <Input
                  id="account"
                  type="text"
                  value={account}
                  onChange={(event) => setAccount(event.target.value)}
                  placeholder="e.g. motar"
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

              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t py-4 text-sm text-muted-foreground">
            Don&apos;t have an account?&nbsp;
            <Button variant="link" className="h-auto p-0" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
