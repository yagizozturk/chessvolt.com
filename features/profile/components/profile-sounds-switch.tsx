"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useBoardSoundsStore } from "@/lib/shared/store/board-sounds-store";

export function ProfileSoundsSwitch() {
  const enabled = useBoardSoundsStore((s) => s.enabled);
  const setEnabled = useBoardSoundsStore((s) => s.setEnabled);

  return (
    <Field className="flex flex-row items-center justify-between gap-4">
      <div className="space-y-1">
        <FieldLabel className="mb-0">Sound effects</FieldLabel>
        <FieldDescription>
          Play move sounds, feedback, and Volt Coach voice on the site.
        </FieldDescription>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={setEnabled}
        aria-label={enabled ? "Mute sounds" : "Unmute sounds"}
      />
    </Field>
  );
}
