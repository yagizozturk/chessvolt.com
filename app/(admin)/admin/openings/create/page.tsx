import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { OpeningForm } from "../main-opening/components/forms/opening-form";

export default function AdminCreateOpeningPage() {
  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/openings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All openings
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>New opening</CardTitle>
          <CardDescription>
            Create a parent opening; you can add variants afterward.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OpeningForm />
        </CardContent>
      </Card>
    </div>
  );
}
