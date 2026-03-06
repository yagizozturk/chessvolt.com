import Link from "next/link";
import { Sword, Star, ChevronRight, Zap, ArrowLeft } from "lucide-react";
import { getGameRiddlesByGameType } from "@/lib/services/game-riddle";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function JourneyPage({ params }: Params) {
  const { slug } = await params;

  const supabase = await createClient();
  const gameType = slug.replace(/-/g, "_");
  const gameRiddles = await getGameRiddlesByGameType(supabase, gameType);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a1147] to-[#0f0a28]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1a1147]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a1147]/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6 bg-white/20" />
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-white"
            >
              <Zap className="h-5 w-5 text-[#FFB800]" />
              chessvolt
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/login">Giriş</Link>
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-[#F69E0B] text-black hover:bg-[#FFB800]"
              asChild
            >
              <Link href="/signup">Kayıt Ol</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-[900px] px-6 pt-12 pb-16">
        {/* Header Section */}
        <div className="mb-12 flex flex-col gap-2 text-center md:text-left">
          <Badge className="w-fit self-center border-[#F69E0B]/30 bg-[#F69E0B]/20 text-[#FFB800] md:self-start">
            CHESS ADVENTURE
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-white capitalize md:text-5xl">
            {slug.replace(/-/g, " ")} Journey
          </h1>
          <p className="text-lg text-white/50">
            Master the tactics and unlock the secrets of this kingdom.
          </p>
        </div>

        {/* Riddles List */}
        {gameRiddles.length === 0 ? (
          <Card className="border-dashed border-white/10 bg-white/5">
            <CardContent className="py-12 text-center text-white/40">
              Bu journey için henüz bir riddle eklenmemiş. Çok yakında!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {gameRiddles.map((riddle, index) => (
              <Link
                key={riddle.id}
                href={`/game-riddle/${riddle.id}`}
                className="group no-underline"
              >
                <Card className="overflow-hidden border-white/10 bg-white/5 transition-all duration-300 group-active:scale-[0.98] hover:border-white/20 hover:bg-white/10">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-6">
                        {/* Level Indicator */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F69E0B] text-xl font-black text-white shadow-[0_4px_0_0_#b45309]">
                          {index + 1}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#FFB800]">
                            {riddle.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-4">
                            {riddle.rating && (
                              <div className="flex items-center gap-1 text-sm text-white/40">
                                <Star size={14} className="text-[#FFB800]" />
                                <span>Rating: {riddle.rating}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-sm text-white/40">
                              <Sword size={14} />
                              <span>Tactical Puzzle</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Status (Unauth olduğu için şimdilik sadece yönlendirme oku) */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/20 transition-all group-hover:bg-[#FFB800] group-hover:text-black">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

/** * JOURNEY ARCHITECTURE NOTES:
 * 1. Unauthenticated Access: getAuthenticatedUser kaldırıldı. Artık sayfa girişi için login zorunlu değil.
 * 2. Component Structure: Veriler artık basit bir <ul> yerine Shadcn Card bileşenleri içinde, daha interaktif bir yapıda sunuluyor.
 * 3. Tactile Feel: Kartlara "group-active:scale-[0.98]" ekleyerek buton gibi basılma hissi verildi.
 * 4. Visual Hierarchy: Level numaraları "Tactile" turuncu kutular içine alınarak oyunlaştırma (gamification) sağlandı.
 * 5. Data Fetching: userGameRiddleRepo bağımlılığı unauth yapıda devre dışı bırakıldı (kullanıcı bazlı ilerleme anonim session veya localstorage ile eklenebilir).
 */
