import type { Metadata } from "next";

import { LegalPage } from "@/features/legal/components/legal-page";
import { TermsContent } from "@/features/legal/components/terms-content";

export const metadata: Metadata = {
  title: "Terms of Service | ChessVolt",
  description: "Read the ChessVolt Terms of Service and Conditions.",
};

export default function TermsPage() {
  async function triggerServerError() {
    'use server'
    throw new Error("Server-side global error test");
  }

  return (
    <LegalPage title="Terms of Service" description="Please read these terms carefully before using ChessVolt.">

      {/* add for testing server-side error handling. After testing, remove this form to avoid accidental errors in production.
        <form action={triggerServerError}>
          <button type="submit">Sunucu Hatası Fırlat</button>
        </form>
      */}
      
      <TermsContent />
    </LegalPage>
  );
}