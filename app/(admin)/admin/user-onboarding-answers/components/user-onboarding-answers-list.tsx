"use client";

import Link from "next/link";

import { deleteUserOnboardingAnswerAction } from "@/app/(admin)/admin/user-onboarding-answers/actions/user-onboarding-answers";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Button } from "@/components/ui/button";
import type { UserOnboardingAnswerWithDetails } from "@/features/user-onboarding-answer/types/user-onboarding-answer";

type Props = {
  answers: UserOnboardingAnswerWithDetails[];
};

export function UserOnboardingAnswersList({ answers }: Props) {
  async function handleDelete(id: string, label: string) {
    if (!confirm(`Delete answer "${label}"?`)) return;
    await deleteUserOnboardingAnswerAction(id);
  }

  if (answers.length === 0) {
    return <EmptyDataMessage message="No user onboarding answers yet." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Question</th>
            <th className="px-4 py-3 font-medium">Answer</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((answer) => {
            const label = `${answer.question.title} → ${answer.option.label}`;
            return (
              <tr key={answer.id} className="border-b last:border-b-0">
                <td className="px-4 py-3">
                  <span className="font-mono text-xs">{answer.userId}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{answer.question.title}</div>
                  <div className="text-muted-foreground font-mono text-xs">/{answer.question.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{answer.option.label}</div>
                  <div className="text-muted-foreground font-mono text-xs">{answer.option.value}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/user-onboarding-answers/edit/${answer.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(answer.id, label)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
