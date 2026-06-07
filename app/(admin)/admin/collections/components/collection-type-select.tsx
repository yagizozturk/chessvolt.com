import { Field, FieldLabel } from "@/components/ui/field";
import {
  COLLECTION_TYPES,
  formatCollectionTypeLabel,
  isCollectionType,
  type CollectionType,
} from "@/features/collection/types/collection-type";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: CollectionType;
  onChange: (value: CollectionType) => void;
  name?: string;
};

export function CollectionTypeSelect({ value, onChange, name = "collectionType" }: Props) {
  return (
    <Field>
      <FieldLabel>Collection type</FieldLabel>
      <select
        name={name}
        required
        value={value}
        onChange={(e) => {
          if (isCollectionType(e.target.value)) onChange(e.target.value);
        }}
        className={cn(
          "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
        )}
      >
        {COLLECTION_TYPES.map((collectionType) => (
          <option key={collectionType} value={collectionType}>
            {formatCollectionTypeLabel(collectionType)}
          </option>
        ))}
      </select>
    </Field>
  );
}
