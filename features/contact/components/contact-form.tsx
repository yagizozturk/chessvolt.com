"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { submitContactAction } from "@/features/contact/actions/submit-contact";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await submitContactAction({ name, email, subject, message });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setLoading(false);
    toast.success("Thanks for reaching out! We've received your message and will reply as soon as we can.");
  }

  return (
    <Card className="border-border/60 shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {error && <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm">{error}</div>}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  maxLength={100}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  maxLength={255}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="subject">Subject (optional)</FieldLabel>
              <Input
                id="subject"
                name="subject"
                placeholder="What is this about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
                maxLength={200}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="message">Message</FieldLabel>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us how we can improve ChessVolt..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={loading}
                rows={6}
                maxLength={5000}
              />
            </Field>
            <Field>
              <Button variant="volt" type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading && <Spinner data-icon="inline-start" />}
                {loading ? "Sending..." : "Send message"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
