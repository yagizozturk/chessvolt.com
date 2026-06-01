"use client";

import Link from "next/link";

import { deleteOnboardingQuestionAction } from "@/app/(admin)/admin/onboarding-questions/actions/onboarding-questions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

type Props = {
  questions: OnboardingQuestion[];
};

export function OnboardingQuestionsList({ questions }: Props) {
  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteOnboardingQuestionAction(id);
  }

  if (questions.length === 0) {
    return <p className="text-muted-foreground text-sm">No onboarding questions yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Sort</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id} className="border-b last:border-b-0">
              <td className="px-4 py-3">
                <div className="font-medium">{question.title}</div>
                <div className="text-muted-foreground font-mono text-xs">/{question.slug}</div>
                {question.description ? (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{question.description}</p>
                ) : null}
              </td>
              <td className="text-muted-foreground px-4 py-3 font-mono">{question.sortOrder}</td>
              <td className="px-4 py-3">
                <Badge variant={question.isActive ? "default" : "secondary"}>
                  {question.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/onboarding-questions/edit/${question.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(question.id, question.title)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
