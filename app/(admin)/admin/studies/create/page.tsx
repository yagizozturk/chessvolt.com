import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { StudyForm } from "@/app/(admin)/admin/studies/components/study-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STUDY_ADMIN_ERRORS: Record<string, string> = {
  missing_fields: "Please fill in all required fields.",
  create_failed: "Could not create the study. Please try again.",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminCreateStudyPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const errorMessage = error ? (STUDY_ADMIN_ERRORS[error] ?? `An error occurred (${error}).`) : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/studies"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All studies
      </Link>
      {errorMessage ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>New study</CardTitle>
          <CardDescription>Create a study to group puzzles on the public site.</CardDescription>
        </CardHeader>
        <CardContent>
          <StudyForm />
        </CardContent>
      </Card>
    </div>
  );
}
