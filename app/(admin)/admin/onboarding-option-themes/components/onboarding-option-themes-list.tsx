"use client";

import Link from "next/link";

import { deleteOnboardingOptionThemeAction } from "@/app/(admin)/admin/onboarding-option-themes/actions/onboarding-option-themes";
import { Button } from "@/components/ui/button";
import type { OnboardingOptionThemeWithDetails } from "@/features/onboarding-option-theme/types/onboarding-option-theme";

type Props = {
  items: OnboardingOptionThemeWithDetails[];
};

export function OnboardingOptionThemesList({ items }: Props) {
  async function handleDelete(id: string, label: string) {
    if (!confirm(`Delete link "${label}"?`)) return;
    await deleteOnboardingOptionThemeAction(id);
  }

  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">No option–theme links yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Option</th>
            <th className="px-4 py-3 font-medium">Theme</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const label = `${item.option.label} → ${item.theme.title}`;
            return (
              <tr key={item.id} className="border-b last:border-b-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.option.label}</div>
                  <div className="text-muted-foreground text-xs">
                    {item.option.question.title} · <span className="font-mono">{item.option.value}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{item.theme.title}</div>
                  <div className="text-muted-foreground font-mono text-xs">/{item.theme.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/onboarding-option-themes/edit/${item.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id, label)}
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
