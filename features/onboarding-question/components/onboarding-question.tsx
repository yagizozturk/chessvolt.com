import { Text } from "@/components/ui/text";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

type OnboardingQuestionProps = {
  question: OnboardingQuestion;
  options: React.ReactNode;
};

export function OnboardingQuestion({ question, options }: OnboardingQuestionProps) {
  return (
    <section className="space-y-4" aria-labelledby={`onboarding-question-${question.id}`}>
      <Text as="h2" variant="heading" id={`onboarding-question-${question.id}`} className="text-center">
        {question.title}
      </Text>
      <div className="pt-2">{options}</div>
    </section>
  );
}
