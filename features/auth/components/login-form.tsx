"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/dashboard");
  }

  async function handleGoogleLogin() {
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="pt-0">
        <div className="flex overflow-hidden rounded-t-xl">
          <div className="flex min-w-0 flex-1 items-end p-4" style={{ backgroundColor: "#5227D4" }}>
            <div className="text-foreground flex flex-col gap-1 text-lg font-bold">Login</div>
          </div>
          <div className="overflow-hidden">
            <img src="/images/form/log-in-account-form-header.png" alt="ChessVolt" height={90} width={180} />
          </div>
        </div>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {error && <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm">{error}</div>}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>
              <div className="flex flex-col gap-3">
                <Button variant="volt" type="submit" disabled={loading}>
                  {loading && <Spinner data-icon="inline-start" />}
                  Login
                </Button>

                <RainbowButton
                  variant="default"
                  className="rounded-2xl"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  {loading && <Spinner data-icon="inline-start" />}
                  LOGIN WITH GOOGLE
                </RainbowButton>

                <p className="text-muted-foreground text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="hover:text-primary underline underline-offset-4">
                    Sign up
                  </Link>
                </p>
              </div>
              <Button variant="voltMuted" className="w-full" asChild>
                <Link href="/collection">Continue As Guest</Link>
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
