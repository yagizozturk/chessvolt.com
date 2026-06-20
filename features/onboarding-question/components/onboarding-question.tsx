import { Text } from "@/components/ui/text";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

type OnboardingQuestionProps = {
  question: OnboardingQuestion;
  options: React.ReactNode;
  /** Reserve space for the step with the most options so the layout does not jump between steps. */
  minOptionCount?: number;
  showSelectAllRow?: boolean;
};

const OPTION_ROW_HEIGHT_REM = 3.5;
const OPTION_GAP_REM = 0.75;
const SELECT_ALL_ROW_REM = 2;

function getOptionsAreaMinHeight(optionCount: number, showSelectAllRow: boolean) {
  const selectAllRem = showSelectAllRow ? SELECT_ALL_ROW_REM : 0;
  const gapsRem = Math.max(0, optionCount - 1) * OPTION_GAP_REM;
  const rowsRem = optionCount * OPTION_ROW_HEIGHT_REM;

  return `${selectAllRem + rowsRem + gapsRem}rem`;
}

export function OnboardingQuestion({
  question,
  options,
  minOptionCount,
  showSelectAllRow = false,
}: OnboardingQuestionProps) {
  const optionsMinHeight =
    minOptionCount !== undefined ? getOptionsAreaMinHeight(minOptionCount, showSelectAllRow) : undefined;

  return (
    <section className="space-y-4" aria-labelledby={`onboarding-question-${question.id}`}>
      <Text as="h2" variant="heading" id={`onboarding-question-${question.id}`} className="text-center">
        {question.title}
      </Text>
      <div className="pt-2" style={optionsMinHeight ? { minHeight: optionsMinHeight } : undefined}>
        {options}
      </div>
    </section>
  );
}
