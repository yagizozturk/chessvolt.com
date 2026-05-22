import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminFormErrorAlert } from "@/features/admin/components/admin-form-error-alert";
import { getAllRiddles } from "@/features/riddle/services/riddle.service";
import { getRiddleAdminErrorMessage } from "@/lib/admin/form-error-messages";
import { getAdminUser } from "@/lib/supabase/auth";
import { Plus } from "lucide-react";
import Link from "next/link";

import { RiddlesList } from "./riddles-list";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminRiddlesPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const riddles = await getAllRiddles(supabase);
  const { error } = await searchParams;
  const errorMessage = getRiddleAdminErrorMessage(error);

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminFormErrorAlert message={errorMessage} />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Game Riddles</h1>
          <p className="text-muted-foreground">
            {riddles.length} game riddle(s) listed
          </p>
        </div>
        <Button asChild>
          <Link
            href="/admin/riddles/new"
            className="flex items-center gap-2"
          >
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
          <RiddlesList riddles={riddles} />
        </CardContent>
      </Card>
    </div>
  );
}
