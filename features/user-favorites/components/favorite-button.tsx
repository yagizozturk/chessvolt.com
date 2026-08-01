"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toggleFavouriteAction } from "@/features/user-favorites/actions/toggle-favorite";
import type { ToggleFavoriteTarget } from "@/features/user-favorites/types/user-favorite";
import { cn } from "@/lib/utils";

type FavouriteButtonProps = ToggleFavoriteTarget & {
  isFavourited: boolean;
  onFavouritedChange: (favourited: boolean) => void;
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid_target: "This item could not be favorited.",
  failed: "Could not update favorite. Please try again.",
};

export function FavouriteButton({ isFavourited, onFavouritedChange, ...target }: FavouriteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const label = isFavourited ? "Remove from favorites" : "Add to favorites";
  const tooltip = isFavourited ? "Remove from favorites" : "Favorite to track your Volt score";

  const handleClick = () => {
    if (isPending) return;

    startTransition(async () => {
      const result = await toggleFavouriteAction(target);

      if (result.ok) {
        onFavouritedChange(result.favourited);
        toast.success(result.favourited ? "Added to favorites" : "Removed from favorites");
        return;
      }

      if (result.reason === "unauthorized") {
        router.push("/login");
        return;
      }

      toast.error(ERROR_MESSAGES[result.reason] ?? "Something went wrong.");
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="voltIcon"
          className="relative"
          onClick={handleClick}
          disabled={isPending}
          aria-label={label}
          aria-pressed={isFavourited}
        >
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={2} />
          {isPending ? <Spinner /> : <Star className={cn("size-5", isFavourited && "fill-primary text-primary")} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
