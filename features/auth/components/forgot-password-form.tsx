"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<typeof Card>) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Enter your email and we&apos;ll send you a link to reset your password</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4">
            <div className="rounded-md bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
              Check your email for the reset link.
            </div>
            <Link href="/login" className="block">
              <Button variant="volt" className="w-full">
                Back to login
              </Button>
            </Link>
          </div>
        ) : (
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
                <Button variant="volt" type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
                <FieldDescription className="text-center">
                  <Link href="/login" className="underline underline-offset-4">
                    Back to login
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
