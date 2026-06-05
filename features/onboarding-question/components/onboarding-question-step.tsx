import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

type OnboardingQuestionStepProps = {
  question: OnboardingQuestion;
  stepNumber?: number;
  hint?: string;
  children?: React.ReactNode;
};

export function OnboardingQuestionStep({
  question,
  stepNumber,
  hint,
  children,
}: OnboardingQuestionStepProps) {
  return (
    <section className="space-y-4" aria-labelledby={`onboarding-question-${question.id}`}>
      {stepNumber != null ? (
        <p className="text-muted-foreground text-sm font-medium">Question {stepNumber}</p>
      ) : null}
      <div className="space-y-2">
        <h2 id={`onboarding-question-${question.id}`} className="text-2xl font-bold tracking-tight">
          {question.title}
        </h2>
        {question.description ? (
          <p className="text-muted-foreground text-base">{question.description}</p>
        ) : null}
        {hint ? <p className="text-muted-foreground text-sm font-medium">{hint}</p> : null}
      </div>
      {children ? <div className="pt-2">{children}</div> : null}
    </section>
  );
}
