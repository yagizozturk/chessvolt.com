export function PrivacyContent({ className }: { className?: string }) {
  return (
    <div className={className}>
      <section className="mb-4">
        <h3 className="mb-2 font-medium">1. Introduction</h3>
        <p className="text-muted-foreground text-sm leading-normal">
          This Privacy Policy explains how ChessVolt collects, uses, and protects your personal information when you use
          our website and services.
        </p>
      </section>
      <section className="mb-4">
        <h3 className="mb-2 font-medium">2. Information We Collect</h3>
        <p className="text-muted-foreground text-sm leading-normal">
          We may collect information you provide directly, such as your email address, username, chess platform handles,
          and messages you send us. We may also collect usage data, device information, and cookies needed to operate and
          improve the service.
        </p>
      </section>
      <section className="mb-4">
        <h3 className="mb-2 font-medium">3. How We Use Information</h3>
        <p className="text-muted-foreground text-sm leading-normal">
          We use your information to create and manage accounts, personalize chess training features, provide support,
          improve product performance, and communicate important service updates. We do not sell your personal
          information.
        </p>
      </section>
      <section className="mb-4">
        <h3 className="mb-2 font-medium">4. Sharing of Information</h3>
        <p className="text-muted-foreground text-sm leading-normal">
          We may share information with trusted service providers who help us operate ChessVolt (for example hosting,
          authentication, or analytics), when required by law, or to protect the rights and safety of ChessVolt and its
          users.
        </p>
      </section>
      <section className="mb-4">
        <h3 className="mb-2 font-medium">5. Data Retention</h3>
        <p className="text-muted-foreground text-sm leading-normal">
          We retain personal information for as long as your account is active or as needed to provide the service, comply
          with legal obligations, resolve disputes, and enforce our agreements.
        </p>
      </section>
      <section className="mb-4">
        <h3 className="mb-2 font-medium">6. Your Choices</h3>
        <p className="text-muted-foreground text-sm leading-normal">
          You may update account details in your profile, request access to or deletion of your personal data, or stop
          using ChessVolt at any time. Some requests may be limited by legal or operational requirements.
        </p>
      </section>
      <section className="mb-4">
        <h3 className="mb-2 font-medium">7. Changes to This Policy</h3>
        <p className="text-muted-foreground text-sm leading-normal">
          We may update this Privacy Policy from time to time. Continued use of ChessVolt after changes are posted
          constitutes acceptance of the revised policy.
        </p>
      </section>
      <section>
        <h3 className="mb-2 font-medium">8. Contact</h3>
        <p className="text-muted-foreground text-sm leading-normal">
          If you have questions about this Privacy Policy, please contact us through the support channels provided on
          ChessVolt.
        </p>
      </section>
    </div>
  );
}
