"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Image from "next/image";
import { Footer } from "@/features/landing/components/footer";
import { Navbar } from "@/features/landing/components/navbar";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
}, [error]);

  return (
    <div className="bg-background text-foreground antialiased bg-brand min-h-svh" style={{ fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif' }}>
      <Navbar />

      <main className="container mx-auto max-w-3xl px-4 pt-28 pb-16 md:px-6 md:pt-32">
        <div className="mb-10 text-center">
          <h1 className="text-secondary text-4xl font-bold tracking-tight md:text-5xl">Opps! Something went wrong :(</h1>
          <p className="text-secondary/80 mx-auto mt-4 max-w-xl text-lg leading-relaxed"><span className="text-primary font-medium">Our team and Volt Coach is on it to get back to the game soon. Brace yourself till we fix it.</span></p>
          {/* <NextError statusCode={0} /> */}
        </div>
        <Image
          src={"/images/error/volt-global-error.png"}
          alt={"Our team and Volt Coach is on it"}
          width={512}
          height={512}
          className="h-auto object-contain w-full" 
        />
      </main>
      
      <Footer />
    </div>
  );
}
