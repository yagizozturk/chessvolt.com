import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Crown, Flame, Star, Target } from "lucide-react"

export function GamificationFeatures() {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Öğrenmeyi Eğlenceye Dönüştür</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Sadece öğrenmekle kalma; liglerde yüksel, nadir rozetler kazan ve arkadaşlarınla rekabet et.
          </p>
        </div>

        <Tabs defaultValue="leaderboard" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="leaderboard">Liderlik Tablosu</TabsTrigger>
            <TabsTrigger value="badges">Başarı Rozetleri</TabsTrigger>
          </TabsList>

          {/* Liderlik Tablosu Ön İzlemesi */}
          <TabsContent value="leaderboard">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" /> Altın Ligi
                </CardTitle>
                <CardDescription>Haftalık sıralamada ilk 3'e girerek bir üst lige yüksel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Sen", xp: "2450 XP", rank: 1, current: true },
                  { name: "Ahmet Y.", xp: "2100 XP", rank: 2 },
                  { name: "Selin K.", xp: "1850 XP", rank: 3 },
                ].map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${user.current ? "bg-primary/5 border-primary" : "bg-background"}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg w-6">{user.rank}.</span>
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">
                        {user.name[0]}
                      </div>
                      <span className={`font-medium ${user.current ? "text-primary" : ""}`}>{user.name}</span>
                    </div>
                    <span className="font-mono font-bold text-primary">{user.xp}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rozetler Ön İzlemesi */}
          <TabsContent value="badges">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: "Seri Katili", desc: "7 Günlük Seri", icon: <Flame className="h-8 w-8 text-orange-500" /> },
                { title: "Bilgin", desc: "50 Ders Tamamla", icon: <Star className="h-8 w-8 text-yellow-500" /> },
                { title: "Keskin Göz", desc: "Hatasız Bölüm", icon: <Target className="h-8 w-8 text-blue-500" /> },
                { title: "Şampiyon", desc: "Lig Birinciliği", icon: <Crown className="h-8 w-8 text-purple-500" /> },
                { title: "Efsane", desc: "Tüm Rozetler", icon: <Medal className="h-8 w-8 text-emerald-500" /> },
                { title: "Gece Kuşu", desc: "Gece Çalışması", icon: <Star className="h-8 w-8 text-indigo-400" /> },
              ].map((badge, i) => (
                <Card key={i} className="text-center p-6 flex flex-col items-center gap-3 transition-hover hover:shadow-md">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                    {badge.icon}
                  </div>
                  <h4 className="font-bold text-sm">{badge.title}</h4>
                  <p className="text-xs text-muted-foreground">{badge.desc}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

{
    /** Notlar:
     * 1. Tabs Kullanımı: Leaderboard ve Badges özelliklerini tek bir alanda toplayarak sayfa uzunluğunu optimize ettik.
     * 2. Koşullu Stil: Leaderboard listesinde kullanıcının kendi sırasını (current: true) vurgulayarak aidiyet hissi yarattık.
     * 3. İkonografi: Lucide-react ikonlarını renkli kullanarak Duolingo'nun canlı ve oyunsu dilini yakaladık.
     * 4. Etkileşim: Kartlara eklenen hafif gölge (hover:shadow-md) ve geçiş efektleri, modern bir UI hissi verir.
     */
}