"use client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { requestDeleteAccount } from "@/features/auth/api/delete-account";
import { createClient } from "@/lib/supabase/client";

export function ProfileDeleteAccountButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    // İstek sürerken diyalog açık kalsın.
    event.preventDefault();
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await requestDeleteAccount();
    } catch {
      setIsDeleting(false);
      toast.error("Could not delete your account. Please try again.");
      return;
    }

    // Kullanıcı artık yok; sadece tarayıcıdaki oturum temizlenir.
    await createClient().auth.signOut({ scope: "local" });
    router.push("/");
    router.refresh();
  }

  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !isDeleting && setOpen(nextOpen)}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive">
          <Trash2Icon data-icon="inline-start" />
          Delete account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes your ChessVolt account and everything in it: your profile and rating, Volt Tracker,
            game analyses and puzzle history. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Spinner data-icon="inline-start" /> : null}
            Delete account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
