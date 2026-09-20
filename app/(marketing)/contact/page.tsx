import type { Metadata } from "next";

import { ContactForm } from "@/features/contact/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | ChessVolt",
  description: "Get in touch with the ChessVolt team. Questions, feedback, and support.",
};

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 pt-28 pb-16 md:px-6 md:pt-32">
      <div className="mb-10 text-center">
        <h1 className="text-4xl text-base font-bold tracking-tight md:text-5xl">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-lg leading-relaxed">
          How can we improve ChessVolt for you? Share your ideas, feedback, or questions with us please.
        </p>
      </div>
      <ContactForm />
    </main>
  );
}
