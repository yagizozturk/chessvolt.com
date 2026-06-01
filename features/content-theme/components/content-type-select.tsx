import { Field, FieldLabel } from "@/components/ui/field";
import {
  CONTENT_TYPES,
  formatContentTypeLabel,
  isContentType,
  type ContentType,
} from "@/features/content-theme/types/content-type";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: ContentType;
  onChange: (value: ContentType) => void;
  name?: string;
};

export function ContentTypeSelect({ value, onChange, name = "contentType" }: Props) {
  return (
    <Field>
      <FieldLabel>Content type</FieldLabel>
      <select
        name={name}
        required
        value={value}
        onChange={(e) => {
          if (isContentType(e.target.value)) onChange(e.target.value);
        }}
        className={cn(
          "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
        )}
      >
        {CONTENT_TYPES.map((contentType) => (
          <option key={contentType} value={contentType}>
            {formatContentTypeLabel(contentType)}
          </option>
        ))}
      </select>
    </Field>
  );
}
