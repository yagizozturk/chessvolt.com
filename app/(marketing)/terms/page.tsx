import type { Metadata } from "next";

import { LegalPage } from "@/features/legal/components/legal-page";
import { TermsContent } from "@/features/legal/components/terms-content";

export const metadata: Metadata = {
  title: "Terms of Service | ChessVolt",
  description: "Read the ChessVolt Terms of Service and Conditions.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" description="Please read these terms carefully before using ChessVolt.">
      <TermsContent />
    </LegalPage>
  );
}
