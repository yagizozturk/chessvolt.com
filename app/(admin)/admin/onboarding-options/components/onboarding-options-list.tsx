"use client";

import Link from "next/link";

import { deleteOnboardingOptionAction } from "@/app/(admin)/admin/onboarding-options/actions/onboarding-options";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OnboardingOptionWithQuestion } from "@/features/onboarding-option/types/onboarding-option-with-question";

type Props = {
  options: OnboardingOptionWithQuestion[];
};

export function OnboardingOptionsList({ options }: Props) {
  async function handleDelete(id: string, label: string) {
    if (!confirm(`Delete "${label}"?`)) return;
    await deleteOnboardingOptionAction(id);
  }

  if (options.length === 0) {
    return <EmptyDataMessage message="No onboarding options yet." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Option</th>
            <th className="px-4 py-3 font-medium">Question</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Sort</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option) => (
            <tr key={option.id} className="border-b last:border-b-0">
              <td className="px-4 py-3">
                <div className="font-medium">{option.label}</div>
                <div className="text-muted-foreground font-mono text-xs">{option.value}</div>
                {option.description ? (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{option.description}</p>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{option.question.title}</div>
                <div className="text-muted-foreground font-mono text-xs">/{option.question.slug}</div>
              </td>
              <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                {option.initialRating != null ? option.initialRating : "—"}
                {option.initialRatingDeviation != null ? ` ±${option.initialRatingDeviation}` : ""}
              </td>
              <td className="text-muted-foreground px-4 py-3 font-mono">{option.sortOrder}</td>
              <td className="px-4 py-3">
                <Badge variant={option.isActive ? "default" : "secondary"}>
                  {option.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/onboarding-options/edit/${option.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(option.id, option.label)}
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
