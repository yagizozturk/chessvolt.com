import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { JourneyHeader } from "@/components/journey/journey-header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuthenticatedUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1147] to-[#0f0a28]">
      <JourneyHeader user={user} backHref="/dashboard" />
      <div>{children}</div>
    </div>
  );
}
