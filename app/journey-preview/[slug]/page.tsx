import Link from "next/link";
import { CheckCircle, XCircle, Sword, Star, ChevronRight, Lock } from "lucide-react";
import { getGameRiddlesByGameType } from "@/lib/services/game-riddle";
import { createClient } from "@/lib/supabase/server"; // Auth yerine doğrudan server client
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function JourneyPage({ params }: Params) {
  const { slug } = await params;
  
  // Auth gereksinimini kaldırdık, doğrudan anonim client kullanıyoruz
  const supabase = await createClient(); 

  const gameType = slug.replace(/-/g, "_");
  
  // Sadece riddle'ları çekiyoruz, kullanıcı denemelerini (attempt) şimdilik pas geçiyoruz
  const gameRiddles = await getGameRiddlesByGameType(supabase, gameType);

  return (
    <main className="min-h-screen pt-28 pb-16 bg-gradient-to-b from-[#1a1147] to-[#0f0a28]">
      <div className="container max-w-[900px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-12 text-center md:text-left">
          <Badge className="w-fit bg-[#F69E0B]/20 text-[#FFB800] border-[#F69E0B]/30 self-center md:self-start">
            CHESS ADVENTURE
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-white capitalize tracking-tight">
            {slug.replace(/-/g, " ")} Journey
          </h1>
          <p className="text-white/50 text-lg">
            Master the tactics and unlock the secrets of this kingdom.
          </p>
        </div>

        {/* Riddles List */}
        {gameRiddles.length === 0 ? (
          <Card className="bg-white/5 border-white/10 border-dashed">
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
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group-active:scale-[0.98]">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-6">
                        {/* Level Indicator */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#F69E0B] text-white font-black text-xl shadow-[0_4px_0_0_#b45309]">
                          {index + 1}
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-[#FFB800] transition-colors">
                            {riddle.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
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
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/20 group-hover:bg-[#FFB800] group-hover:text-black transition-all">
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