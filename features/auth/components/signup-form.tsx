"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { TermsAndConditionsDialog } from "@/features/auth/components/terms-and-conditions-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

export function SignupForm({ className, ...props }: React.ComponentProps<typeof Card>) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the Terms and Conditions to create an account");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user?.identities?.length === 0) {
      setError("An account with this email already exists. Please sign in.");
      setLoading(false);
      return;
    }

    setLoading(false);

    // Supabase may require email confirmation - check auth config
    if (data.session) {
      router.refresh();
      router.push("/dashboard");
    } else {
      setSuccess(true);
    }
  }

  async function handleGoogleSignup() {
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <Card className={cn("pt-0", className)} {...props}>
      <div className="flex overflow-hidden rounded-t-xl">
        <div className="flex min-w-0 flex-1 items-end p-4" style={{ backgroundColor: "#4E22CE" }}>
          <div className="text-foreground flex flex-col gap-1 text-lg font-bold">Sign Up</div>
        </div>
        <div className="overflow-hidden">
          <img src="/images/form/create-account-form-header.png" alt="ChessVolt" width={180} height={90} />
        </div>
      </div>
      <CardContent>
        {success ? (
          <div className="rounded-md bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
            Check your email to confirm your account. Then you can sign in.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {error && <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm">{error}</div>}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>
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
                <FieldDescription>
                  We&apos;ll use this to contact you. We will not share your email with anyone else.
                </FieldDescription>
              </Field>
              <div className="flex flex-col gap-3">
                <div className="flex gap-4">
                  <Field className="min-w-0 flex-1">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </Field>
                  <Field className="min-w-0 flex-1">
                    <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </Field>
                </div>
                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
              </div>
              <Field orientation="horizontal" className="items-start">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  disabled={loading}
                />
                <FieldContent>
                  <div className="text-sm leading-snug">
                    <label htmlFor="terms" className="cursor-pointer">
                      I agree to the{" "}
                    </label>
                    <button
                      type="button"
                      className="underline underline-offset-4 hover:text-primary"
                      onClick={() => setTermsOpen(true)}
                    >
                      Terms and Conditions
                    </button>
                  </div>
                </FieldContent>
              </Field>
              <TermsAndConditionsDialog open={termsOpen} onOpenChange={setTermsOpen} />
              <div className="flex flex-col gap-3">
                <Button variant="volt" type="submit" disabled={loading || !acceptedTerms}>
                  {loading && <Spinner data-icon="inline-start" />}
                  Create Account
                </Button>
                <RainbowButton
                  variant="default"
                  className="rounded-2xl"
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                >
                  {loading && <Spinner data-icon="inline-start" />}
                  SIGN UP WITH GOOGLE
                </RainbowButton>
              </div>
              <p className="px-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                  Sign in
                </Link>
              </p>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
