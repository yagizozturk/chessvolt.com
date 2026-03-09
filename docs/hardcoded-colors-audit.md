# Hardcoded Colors Audit

Projede tema değiştiğinde güncellenmeyen sabit renk kullanımları. Tema tutarlılığı için `globals.css` değişkenlerini (`primary`, `secondary`, `muted`, `destructive` vb.) kullanmak önerilir.

---

## Tema ile Değişmesi Gerekenler

| Dosya | Sorun | Öneri |
|-------|-------|-------|
| **components/app-sidebar.tsx** | `text-[#14b8a6]`, `text-[#00B3FF]`, `text-[#fcc800]`, `bg-[#2C4F5A]` vb. | `text-primary`, `bg-primary/20` |
| **components/landing/challenge-preview.tsx** | `border-orange-700`, `bg-orange-400`, `bg-slate-200` | `border-primary`, `bg-primary`, `bg-muted` |
| **app/(dashboard)/challenge/[slug]/page.tsx** | `#F69E0B`, `#FFB800` (altın/amber) | `text-primary`, `bg-primary` |
| **app/(marketing)/challenge-preview/[slug]/page.tsx** | Aynı hex renkler | `text-primary`, `bg-primary` |
| **components/controller/puzzle-controller.tsx** | `text-[#FFB800]`, `text-orange-400` | `text-primary` |
| **components/controller/riddle-controller.tsx** | `text-[#FFB800]`, `bg-[#F69E0B]/20` | `text-primary`, `bg-primary/20` |
| **app/storybook/page.tsx** | `text-[#fcc800]` (Zap ikonu) | `text-primary` |
| **components/landing/gamification-features.tsx** | `bg-slate-50/50`, `bg-slate-100` | `bg-muted`, `bg-muted/80` |

---

## Semantik Renkler (Yeşil/Kırmızı)

| Dosya | Kullanım | Not |
|-------|----------|-----|
| **components/auth/signup-form.tsx** | `bg-green-500/10 text-green-600` (başarı mesajı) | `bg-primary/10 text-primary` veya ayrı `success` değişkeni |
| **app/(auth)/forgot-password/page.tsx** | Aynı yeşil başarı stili | Aynı öneri |
| **components/challenge/challenge-map.tsx** | `bg-green-500/20 text-green-400` (tamamlanan) | `bg-primary/20 text-primary` veya `success` |
| **app/(dashboard)/challenge/[slug]/page.tsx** | `green` (doğru), `red` (yanlış) | `text-primary` / `text-destructive` |

---

## Bilinçli Kullanım (Değiştirmeyebilirsin)

- **components/landing/game-modes.tsx** — Her mod için farklı renk (amber, sky, violet vb.) → çeşitlilik için
- **components/landing/gamification-features.tsx** — Rozet ikonları (flame, star, crown vb.) → her rozet kendi rengi
- **components/landing/navbar.tsx** — `bg-slate-950/95` (mobil sheet) → koyu overlay için
- **components/landing/hero.tsx** — `#1A1147` gradient → özel hero arka planı
- **app/storybook/page.tsx** — Hex değerleri dokümantasyon için

---

## Öncelikli Düzeltmeler

1. **app-sidebar.tsx** — Tüm hex renkleri tema değişkenlerine taşı
2. **challenge-preview.tsx** — Seviye butonları için `primary` / `muted`
3. **challenge/[slug]** ve **challenge-preview/[slug]** — `#F69E0B` / `#FFB800` → `primary`
4. **puzzle-controller** ve **riddle-controller** — `#FFB800` → `primary`
5. **gamification-features.tsx** — `bg-slate-*` → `bg-muted`

---

## Diğer Hardcoded Renkler

| Dosya | Detay |
|-------|-------|
| **components/game/user-stats.tsx** | `#374151`, `#38BDF8`, `#EF4444` (fill/color) |
| **components/riddle-board/riddle-board.tsx** | `bg-gray-100` |
| **components/game/stat-item.tsx** | Yorumda `bg-blue-500` örneği |
