"use client";

import Link from "next/link";

import { deleteStudyAction } from "@/app/(admin)/admin/studies/actions/studies";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StudyWithPuzzleCount } from "@/features/study/types/study";
import { formatStudyDifficultyLabel } from "@/features/study/utilities/study-difficulty.utils";
import { formatStudyPuzzleCount } from "@/features/study/utilities/study-puzzle-count-format.utils";

type Props = {
  studies: StudyWithPuzzleCount[];
};

export function StudiesList({ studies }: Props) {
  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? Puzzle links in this study will also be removed.`)) return;
    await deleteStudyAction(id);
  }

  if (studies.length === 0) {
    return <EmptyDataMessage message="No studies yet." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {studies.map((study) => (
        <div key={study.id} className="border-border flex min-h-0 flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/studies/${study.slug}`}
              className="hover:text-primary line-clamp-2 min-w-0 font-medium transition-colors"
            >
              {study.title}
            </Link>
            <Badge variant={study.isActive ? "default" : "secondary"}>
              {study.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground line-clamp-2 text-xs">{study.description || "No description"}</p>
          <p className="text-muted-foreground text-xs">
            {formatStudyDifficultyLabel(study.difficulty)} · {formatStudyPuzzleCount(study.puzzleCount)} ·
            /{study.slug}
          </p>
          <div className="mt-auto flex flex-wrap gap-2">
            <Link href={`/admin/studies/edit/${study.id}`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDelete(study.id, study.title)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
