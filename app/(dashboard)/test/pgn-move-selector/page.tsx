import Link from "next/link";

/**
 * PGN / JSON varyant düzenleyici admin’e taşındı:
 * `/admin/openings/variants/new`
 */
export default function PgnMoveSelectorPage() {
  return (
    <div className="container mx-auto max-w-lg space-y-4 p-8">
      <p className="text-muted-foreground text-sm">
        Bu araç artık admin altında: JSON ile varyant oluşturma, tahta ve
        gönderim tek sayfada.
      </p>
      <Link
        href="/admin/openings/variants/new"
        className="text-primary inline-flex text-sm font-medium underline-offset-4 hover:underline"
      >
        Admin — New Opening Variant (JSON)
      </Link>
    </div>
  );
}
