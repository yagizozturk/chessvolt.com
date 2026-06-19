"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className={cn("pt-0", className)} {...props}>
      <div className="flex overflow-hidden rounded-t-xl">
        <div className="flex min-w-0 flex-1 items-end p-4" style={{ backgroundColor: "#5227D4" }}>
          <div className="text-foreground flex flex-col gap-1 text-lg font-bold">Reset password</div>
        </div>
        <div className="overflow-hidden">
          <img src="/images/form/log-in-form-header.png" alt="ChessVolt" width={180} height={90} />
        </div>
      </div>
      <CardContent>
        <p className="text-muted-foreground mb-4 text-sm">
          Enter your email and we&apos;ll send you a link to reset your password
        </p>
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
                <Button variant="volt" type="submit" disabled={loading || !email.trim()} className="w-full">
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
