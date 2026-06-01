import type { UserOnboardingAnswerWithDetails } from "@/features/user-onboarding-answer/types/user-onboarding-answer";

type Props = {
  answers: UserOnboardingAnswerWithDetails[];
};

export function UserOnboardingAnswersSummary({ answers }: Props) {
  if (answers.length === 0) {
    return <p className="text-muted-foreground text-sm">No onboarding answers yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {answers.map((answer) => (
        <li key={answer.id} className="border-border rounded-lg border p-4">
          <p className="font-medium">{answer.question.title}</p>
          {answer.question.description ? (
            <p className="text-muted-foreground mt-1 text-sm">{answer.question.description}</p>
          ) : null}
          <p className="mt-2 text-sm">
            <span className="text-muted-foreground">Your answer: </span>
            {answer.option.label}
          </p>
        </li>
      ))}
    </ul>
  );
}
