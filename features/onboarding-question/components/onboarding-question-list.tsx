import { OnboardingQuestion } from "@/features/onboarding-question/components/onboarding-question";
import type { OnboardingQuestion as OnboardingQuestionModel } from "@/features/onboarding-question/types/onboarding-question";

type OnboardingQuestionListProps = {
  questions: OnboardingQuestionModel[];
  renderOptions: (question: OnboardingQuestionModel, index: number) => React.ReactNode;
};

export function OnboardingQuestionList({ questions, renderOptions }: OnboardingQuestionListProps) {
  if (questions.length === 0) {
    return <p className="text-muted-foreground text-sm">No onboarding questions available.</p>;
  }

  return (
    <div className="space-y-10">
      {questions.map((question, index) => (
        <OnboardingQuestion
          key={question.id}
          question={question}
          options={renderOptions(question, index)}
        />
      ))}
    </div>
  );
}
