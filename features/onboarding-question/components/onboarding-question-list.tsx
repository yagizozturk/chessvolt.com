import { OnboardingQuestionStep } from "@/features/onboarding-question/components/onboarding-question-step";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

type OnboardingQuestionListProps = {
  questions: OnboardingQuestion[];
  renderOptions?: (question: OnboardingQuestion, index: number) => React.ReactNode;
};

export function OnboardingQuestionList({ questions, renderOptions }: OnboardingQuestionListProps) {
  if (questions.length === 0) {
    return <p className="text-muted-foreground text-sm">No onboarding questions available.</p>;
  }

  return (
    <div className="space-y-10">
      {questions.map((question, index) => (
        <OnboardingQuestionStep key={question.id} question={question} stepNumber={index + 1}>
          {renderOptions?.(question, index)}
        </OnboardingQuestionStep>
      ))}
    </div>
  );
}
