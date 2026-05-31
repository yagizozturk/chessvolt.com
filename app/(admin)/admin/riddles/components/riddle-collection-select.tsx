import { Field, FieldLabel } from "@/components/ui/field";
import type { Collection } from "@/features/collection/types/collection";
import { cn } from "@/lib/utils/cn";

type Props = {
  collections: Collection[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
};

export function RiddleCollectionSelect({
  collections,
  value,
  onChange,
  name = "collectionId",
  required = true,
}: Props) {
  return (
    <Field>
      <FieldLabel>Collection</FieldLabel>
      <select
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
        )}
      >
        {!required ? <option value="">No collection</option> : null}
        {collections.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.title}
            {!collection.isActive ? " (inactive)" : ""}
          </option>
        ))}
      </select>
    </Field>
  );
}
