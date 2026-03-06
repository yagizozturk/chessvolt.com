import { UserStats } from "@/components/game/user-stats";
import { GameNavbar } from "@/components/game/navbar";
import { JourneyMap } from "@/components/journey/journey-map";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <GameNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex">
          <div className="rounded-lg border p-4">
            <JourneyMap />
          </div>

          <div className="rounded-lg border p-4">
            <UserStats />
          </div>
        </div>
      </div>
    </div>
  );
}
