// TODO: Refactor
import type { Metadata } from "next";

import { LegalPage } from "@/features/legal/components/legal-page";
import { PrivacyContent } from "@/features/legal/components/privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy | ChessVolt",
  description: "Learn how ChessVolt collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How we collect, use, and protect your information when you use ChessVolt."
    >
      <PrivacyContent />
    </LegalPage>
  );
}
