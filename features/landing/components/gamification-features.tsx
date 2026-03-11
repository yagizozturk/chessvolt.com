import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Crown, Flame, Star, Target } from "lucide-react"

export function GamificationFeatures() {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Turn Learning Into Fun</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Don't just learn; rise through the leagues, earn rare badges, and compete with friends.
          </p>
        </div>

        <Tabs defaultValue="leaderboard" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="badges">Achievement Badges</TabsTrigger>
          </TabsList>

          {/* Leaderboard Preview */}
          <TabsContent value="leaderboard">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" /> Gold League
                </CardTitle>
                <CardDescription>Rise to the next league by ranking in the top 3 in the weekly standings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "You", xp: "2450 XP", rank: 1, current: true },
                  { name: "Alex M.", xp: "2100 XP", rank: 2 },
                  { name: "Sam K.", xp: "1850 XP", rank: 3 },
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

          {/* Badges Preview */}
          <TabsContent value="badges">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: "Streak Master", desc: "7 Day Streak", icon: <Flame className="h-8 w-8 text-orange-500" /> },
                { title: "Scholar", desc: "Complete 50 Lessons", icon: <Star className="h-8 w-8 text-yellow-500" /> },
                { title: "Sharp Eye", desc: "Flawless Section", icon: <Target className="h-8 w-8 text-blue-500" /> },
                { title: "Champion", desc: "League First Place", icon: <Crown className="h-8 w-8 text-purple-500" /> },
                { title: "Legend", desc: "All Badges", icon: <Medal className="h-8 w-8 text-emerald-500" /> },
                { title: "Night Owl", desc: "Night Study", icon: <Star className="h-8 w-8 text-indigo-400" /> },
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
    /** Notes:
     * 1. Tabs: Optimized page length by combining Leaderboard and Badges in one area.
     * 2. Conditional Style: Highlights user's own rank (current: true) in leaderboard for belonging.
     * 3. Iconography: Duolingo's lively, playful language with colorful Lucide-react icons.
     * 4. Interaction: Light shadow (hover:shadow-md) and transitions for modern UI feel.
     */
}