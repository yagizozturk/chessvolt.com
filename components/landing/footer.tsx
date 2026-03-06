import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Logo ve Motto */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="font-bold text-2xl tracking-tighter text-primary">
              VOLT
            </Link>
            <p className="mt-4 text-muted-foreground max-w-xs text-sm leading-relaxed">
              Dil öğrenmeyi oyunlaştıran, topluluk odaklı ve modern eğitim platformu. 
              Sınırlarını zorla, Volt ile parla.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Öğrenin</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/courses" className="text-muted-foreground hover:text-foreground">Kurslar</Link></li>
              <li><Link href="/journey" className="text-muted-foreground hover:text-foreground">Yol Haritası</Link></li>
              <li><Link href="/leaderboard" className="text-muted-foreground hover:text-foreground">Sıralama</Link></li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Kurumsal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">Hakkımızda</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">İletişim</Link></li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Yasal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Gizlilik</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Şartlar</Link></li>
              <li><Link href="/cookies" className="text-muted-foreground hover:text-foreground">Çerezler</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 VOLT Learning Inc. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:underline text-balance tracking-tight">Türkiye (TR)</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

{
    /** Notlar:
     * 1. Grid Düzeni: Mobilde 2 kolon, masaüstünde 4-5 kolon olacak şekilde responsive (duyarlı) yapı kuruldu.
     * 2. Sosyal İkonlar: Lucide-react ikonları kullanılarak standart bir sosyal medya alanı oluşturuldu.
     * 3. Renk Dengesi: "text-muted-foreground" ile yan menülerin ana içerikten daha az baskın olması sağlandı.
     * 4. Alt Bilgi: Telif hakkı ve dil seçimi gibi detaylar en alta, ince bir çizgiyle ayrılmış şekilde eklendi.
     */
}