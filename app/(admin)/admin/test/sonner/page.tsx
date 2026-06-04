"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function TestSonnerPage() {
  return (
    <Button variant="outline" onClick={() => toast("Event has been created", { position: "bottom-center" })}>
      Bottom Center
    </Button>
  );
}
