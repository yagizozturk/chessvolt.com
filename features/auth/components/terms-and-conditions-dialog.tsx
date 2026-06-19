"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TermsAndConditionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TermsAndConditionsDialog({ open, onOpenChange }: TermsAndConditionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read these terms carefully before using ChessVolt.
          </DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          <section className="mb-4">
            <h3 className="mb-2 font-medium">1. Acceptance of Terms</h3>
            <p className="text-muted-foreground text-sm leading-normal">
              By creating an account and using ChessVolt, you agree to be bound by these Terms and Conditions. If you do
              not agree, please do not use our services.
            </p>
          </section>
          <section className="mb-4">
            <h3 className="mb-2 font-medium">2. Use of Service</h3>
            <p className="text-muted-foreground text-sm leading-normal">
              ChessVolt provides chess-related tools and content for personal, non-commercial use unless otherwise
              agreed. You agree to use the platform responsibly and in compliance with applicable laws.
            </p>
          </section>
          <section className="mb-4">
            <h3 className="mb-2 font-medium">3. Account Responsibilities</h3>
            <p className="text-muted-foreground text-sm leading-normal">
              You are responsible for maintaining the confidentiality of your account credentials and for all activity
              that occurs under your account. Notify us immediately of any unauthorized use.
            </p>
          </section>
          <section className="mb-4">
            <h3 className="mb-2 font-medium">4. Content and Intellectual Property</h3>
            <p className="text-muted-foreground text-sm leading-normal">
              All content, branding, and software on ChessVolt are owned by ChessVolt or its licensors. You may not copy,
              modify, distribute, or reverse engineer any part of the service without prior written consent.
            </p>
          </section>
          <section className="mb-4">
            <h3 className="mb-2 font-medium">5. Privacy</h3>
            <p className="text-muted-foreground text-sm leading-normal">
              Your use of ChessVolt is also governed by our Privacy Policy, which describes how we collect, use, and
              protect your personal information.
            </p>
          </section>
          <section className="mb-4">
            <h3 className="mb-2 font-medium">6. Limitation of Liability</h3>
            <p className="text-muted-foreground text-sm leading-normal">
              ChessVolt is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, we disclaim all
              warranties and shall not be liable for any indirect, incidental, or consequential damages arising from your
              use of the service.
            </p>
          </section>
          <section className="mb-4">
            <h3 className="mb-2 font-medium">7. Changes to Terms</h3>
            <p className="text-muted-foreground text-sm leading-normal">
              We may update these Terms and Conditions from time to time. Continued use of ChessVolt after changes are
              posted constitutes acceptance of the revised terms.
            </p>
          </section>
          <section>
            <h3 className="mb-2 font-medium">8. Contact</h3>
            <p className="text-muted-foreground text-sm leading-normal">
              If you have questions about these terms, please contact us through the support channels provided on
              ChessVolt.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
