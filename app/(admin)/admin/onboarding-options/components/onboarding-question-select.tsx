import { Field, FieldLabel } from "@/components/ui/field";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";
import { cn } from "@/lib/utils/cn";

type Props = {
  questions: OnboardingQuestion[];
  value: string;
  onChange: (questionId: string) => void;
  name?: string;
};

export function OnboardingQuestionSelect({ questions, value, onChange, name = "questionId" }: Props) {
  return (
    <Field>
      <FieldLabel>Question</FieldLabel>
      <select
        name={name}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
        )}
      >
        <option value="" disabled>
          Select a question
        </option>
        {questions.map((question) => (
          <option key={question.id} value={question.id}>
            {question.title} ({question.slug})
          </option>
        ))}
      </select>
    </Field>
  );
}
