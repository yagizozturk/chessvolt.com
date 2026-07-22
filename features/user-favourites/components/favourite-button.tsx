"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toggleFavouriteAction } from "@/features/user-favourites/actions/toggle-favourite";
import type { ToggleFavouriteTarget } from "@/features/user-favourites/types/user-favourite";
import { cn } from "@/lib/utils";

type FavouriteButtonProps = ToggleFavouriteTarget & {
  initialIsFavourited: boolean;
};

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: "Sign in to save favourites.",
  invalid_target: "This item could not be favourited.",
  failed: "Could not update favourite. Please try again.",
};

export function FavouriteButton({ initialIsFavourited, ...target }: FavouriteButtonProps) {
  const router = useRouter();
  const [isFavourited, setIsFavourited] = useState(initialIsFavourited);
  const [isPending, startTransition] = useTransition();
  const targetKey = "openingVariantId" in target ? target.openingVariantId : target.riddleId;

  useEffect(() => {
    setIsFavourited(initialIsFavourited);
  }, [initialIsFavourited, targetKey]);

  const handleClick = () => {
    if (isPending) return;

    startTransition(async () => {
      const result = await toggleFavouriteAction(target);

      if (result.ok) {
        setIsFavourited(result.favourited);
        toast.success(result.favourited ? "Added to favourites" : "Removed from favourites");
        router.refresh();
        return;
      }

      toast.error(ERROR_MESSAGES[result.reason] ?? "Something went wrong.");
    });
  };

  return (
    <Button
      type="button"
      variant="voltIcon"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
      title={isFavourited ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={isFavourited}
    >
      {isPending ? (
        <Spinner />
      ) : (
        <Star className={cn("size-5", isFavourited && "fill-primary text-primary")} />
      )}
    </Button>
  );
}
