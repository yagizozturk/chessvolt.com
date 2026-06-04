"use client";

import { ListPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { addOpeningVariantToPracticeAction } from "@/features/user-practice-opening-variant/actions/add-opening-variant-to-practice";

type AddToPracticeButtonProps = {
  openingVariantId: string;
  initialInPracticeList: boolean;
};

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: "Sign in to save variants to your practice list.",
  invalid_variant_id: "This variant could not be saved.",
  already_added: "This variant is already in your practice list.",
  failed: "Could not add to your practice list. Please try again.",
};

export function AddToPracticeButton({ openingVariantId, initialInPracticeList }: AddToPracticeButtonProps) {
  const router = useRouter();
  const [inPracticeList, setInPracticeList] = useState(initialInPracticeList);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setInPracticeList(initialInPracticeList);
  }, [initialInPracticeList, openingVariantId]);

  const handleClick = () => {
    if (inPracticeList || isPending) return;

    startTransition(async () => {
      const result = await addOpeningVariantToPracticeAction(openingVariantId);

      if (result.ok) {
        setInPracticeList(true);
        toast.success("Added to your practice list");
        router.refresh();
        return;
      }

      if (result.reason === "unauthorized") {
        toast.error(ERROR_MESSAGES.unauthorized);
        return;
      }

      if (result.reason === "already_added") {
        setInPracticeList(true);
      }

      toast.error(ERROR_MESSAGES[result.reason] ?? "Something went wrong.");
    });
  };

  if (inPracticeList) {
    return (
      <div className="mb-4">
        <Button type="button" variant="voltGreen" className="w-full" disabled>
          <ListPlus data-icon="inline-start" />
          In my practice list
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Button
        type="button"
        variant="voltGreen"
        className="w-full"
        onClick={handleClick}
        disabled={isPending}
      >
        <ListPlus data-icon="inline-start" />
        Add to my practice list
      </Button>
    </div>
  );
}
