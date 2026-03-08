import { getAdminUser } from "@/lib/supabase/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { RepForm } from "../rep-form";

export default async function AdminRepNewPage() {
  await getAdminUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/reps" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Listeye Dön
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Repertoire</CardTitle>
          <CardDescription>
            Yeni bir repertoire ekleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RepForm />
        </CardContent>
      </Card>
    </div>
  );
}
