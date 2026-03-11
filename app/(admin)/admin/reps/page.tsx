import { getAdminUser } from "@/lib/supabase/auth";
import { getAllReps } from "@/features/reps/services/reps";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { RepsList } from "./reps-list";

export default async function AdminRepsPage() {
  const { supabase } = await getAdminUser();
  const reps = await getAllReps(supabase);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reps</h1>
          <p className="text-muted-foreground">
            {reps.length} repertoire(s) listed
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/reps/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>List</CardTitle>
          <CardDescription>
            Click a row to go to the detail page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RepsList reps={reps} />
        </CardContent>
      </Card>
    </div>
  );
}
