import { getAdminUser } from "@/lib/supabase/auth";
import * as gameRepo from "@/features/game/repository/game.repository";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminFormErrorAlert } from "@/features/admin/components/admin-form-error-alert";
import { getRiddleAdminErrorMessage } from "@/lib/admin/form-error-messages";
import { ArrowLeft } from "lucide-react";
import { RiddleForm } from "../riddle-form";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminRiddleNewPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const games = await gameRepo.findAll(supabase);
  const { error } = await searchParams;
  const errorMessage = getRiddleAdminErrorMessage(error);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/riddles" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </Button>
      </div>

      <AdminFormErrorAlert message={errorMessage} />

      <Card>
        <CardHeader>
          <CardTitle>New Game Riddle</CardTitle>
          <CardDescription>Add a new game riddle</CardDescription>
        </CardHeader>
        <CardContent>
          <RiddleForm games={games} />
        </CardContent>
      </Card>
    </div>
  );
}
