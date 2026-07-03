import { AdminTestBoard } from "@/app/(admin)/admin/test/board/components/admin-test-board";

export default function AdminTestBoardPage() {
  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Test Board</h1>
        <p className="text-muted-foreground text-sm">
          Responsive layout playground for VoltBoard. Resize the browser or toggle modes to compare
          approaches.
        </p>
      </div>
      <AdminTestBoard />
    </div>
  );
}
