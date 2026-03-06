/**
 * h-screen: fills viewport height.
 * max-w-3xl: content never exceeds 3xl width
 */

import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getAuthenticatedUser();

  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
