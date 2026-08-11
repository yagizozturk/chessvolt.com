"use client";

import Lottie from "lottie-react";
import { ZapIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toggleFavoriteAction } from "@/features/user-favorites/actions/toggle-favorite";
import type { ToggleFavoriteTarget } from "@/features/user-favorites/types/user-favorite";
import { cn } from "@/lib/utils";
import favoriteAnimationData from "@/public/images/animations/animation-favorite.json";

type FavoriteButtonProps = ToggleFavoriteTarget & {
  isFavorited: boolean;
  onFavoritedChange: (favorited: boolean) => void;
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid_target: "This item could not be favorited.",
  failed: "Could not update favorite. Please try again.",
};

export function FavoriteButton({ isFavorited, onFavoritedChange, ...target }: FavoriteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const label = isFavorited ? "Remove from favorites" : "Add to favorites";
  const tooltip = isFavorited ? "Remove from favorites" : "Favorite to track your Volt score";

  const handleClick = () => {
    if (isPending) return;

    startTransition(async () => {
      const result = await toggleFavoriteAction(target);

      if (result.ok) {
        onFavoritedChange(result.favorited);
        toast("", {
          position: "bottom-right",
          description: (
            <div className="flex items-center">
              <div className="size-16 shrink-0 overflow-hidden">
                <Lottie animationData={favoriteAnimationData} loop={false} autoplay className="size-full" />
              </div>
              <div>
                <p className="text-base font-bold">
                  {result.favorited ? "Added to favorites" : "Removed from favorites"}
                </p>
              </div>
            </div>
          ),
          duration: 4000,
        });
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
          aria-pressed={isFavorited}
        >
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={2} />
          {isPending ? <Spinner /> : <ZapIcon className={cn("size-5", isFavorited && "fill-primary text-primary")} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
