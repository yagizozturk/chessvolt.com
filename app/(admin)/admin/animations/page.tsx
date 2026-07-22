import { readdir } from "node:fs/promises";
import path from "node:path";

import { getAdminUser } from "@/lib/supabase/auth";

import { AnimationsList, type AnimationFile } from "./components/animations-list";

const ANIMATIONS_DIR = path.join(process.cwd(), "public/images/animations");
const PUBLIC_BASE = "/images/animations";

async function getLottieAnimations(): Promise<AnimationFile[]> {
  const entries = await readdir(ANIMATIONS_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => ({
      name: entry.name,
      src: `${PUBLIC_BASE}/${entry.name}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default async function AdminAnimationsPage() {
  await getAdminUser();
  const animations = await getLottieAnimations();

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight">Animations</h2>
          <p className="text-muted-foreground text-sm">
            {animations.length} Lottie JSON file{animations.length === 1 ? "" : "s"} in{" "}
            <code className="text-xs">public/images/animations</code>
          </p>
        </div>
        <div className="mt-4">
          <AnimationsList animations={animations} />
        </div>
      </section>
    </div>
  );
}
