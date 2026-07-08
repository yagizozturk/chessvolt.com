// TODO: Refactor
# Chessvolt `content_themes.weight` Mantığı

`content_themes.weight`, bir içeriğin bir theme’e ne kadar güçlü bağlı olduğunu gösterir.

Bu alan hesaplama zorunluluğu değildir; öneri sisteminde sıralama ve önceliklendirme için kullanılır.

---

## Neden var?

Bir içerik tek bir theme’e ait olmayabilir.

Örnek:

```txt
Riddle A
- fork
- attraction
- sacrifice
```

Bu riddle’ın ana fikri `fork` olabilir ama içinde `attraction` ve `sacrifice` fikirleri de bulunabilir.

Bu durumda hepsini aynı güçte işaretlemek doğru olmaz.

---

## Basit weight mantığı

```txt
Ana tema        → 10
İkincil tema    → 6-8
Bağlam teması   → 2-5
Fallback theme  → 1
```

Örnek:

```txt
fork        weight 10
attraction  weight 8
sacrifice   weight 7
middlegame  weight 3
mixed       weight 1
```

---

## Lichess datası varsa nasıl kullanılmalı?

Lichess puzzle datasında theme tag’leri varsa GPT’ye gerek yoktur.

Örnek Lichess tag’leri:

```txt
advantage attraction fork middlegame sacrifice veryLong
```

Bunu Chessvolt theme’lerine şöyle maplemek mantıklı olur:

```txt
fork        → 10
attraction  → 8
sacrifice   → 7
middlegame  → 3
advantage   → 2
veryLong    → ignore
```

Burada önemli olan listedeki ilk tag’e otomatik 10 vermek değildir.

Daha doğru kural:

```txt
Taktik motif varsa       → yüksek weight
İkincil taktik varsa     → orta-yüksek weight
Bağlam tag’i varsa       → düşük weight
Noise tag varsa          → ignore
```

---

## Önerilen import stratejisi

Milyonlarca riddle için admin panelden elle düzeltme yapılmaz.

Bu yüzden import sırasında otomatik mapping kullanılmalı.

Örnek:

```ts
const LICHESS_THEME_MAP = {
  fork: { theme: "fork", weight: 10 },
  pin: { theme: "pin", weight: 10 },
  skewer: { theme: "skewer", weight: 10 },
  attraction: { theme: "attraction", weight: 8 },
  deflection: { theme: "removing_defender", weight: 8 },
  sacrifice: { theme: "sacrifice", weight: 7 },
  discoveredAttack: { theme: "discovered_attack", weight: 9 },
  backRankMate: { theme: "back_rank_mate", weight: 10 },
  mate: { theme: "mate_patterns", weight: 10 },
  endgame: { theme: "endgame", weight: 5 },
  middlegame: { theme: "mixed", weight: 2 },
};
```

Bu mapping backend import logic içinde tutulabilir.

---

## Teması bilinmeyen data

Eğer data Lichess gibi hazır theme bilgisi içermiyorsa:

```txt
content → mixed weight 1
```

Bu en güvenli fallback’tir.

GPT burada sadece özel ve az sayıdaki datasetler için kullanılmalı.

Önerilen kullanım:

```txt
Lichess tag varsa → otomatik map
Tag yoksa → mixed
Özel dataset varsa → GPT batch classification
```

GPT milyonlarca kayıt için ana import motoru olmamalı.

---

## GPT ne zaman kullanılabilir?

GPT şu durumda kullanılabilir:

```txt
FEN + move sequence + PGN var
ama theme tag yok
ve dataset küçük/önemli
```

GPT şunları tahmin edebilir:

```txt
- ana theme
- yan theme’ler
- yaklaşık weight
- difficulty tahmini
- açıklama/hint metni
```

Ama bu tahmin kesin değildir.

---

## Feed üretiminde weight nasıl kullanılır?

Kullanıcı onboarding’de bir hedef seçer.

Örnek:

```txt
Find tactics faster
```

Bu cevap theme’lere bağlanır:

```txt
fork    weight 10
pin     weight 9
skewer  weight 8
```

Bir riddle da şöyle taglenmiş olabilir:

```txt
fork        weight 10
sacrifice   weight 7
```

Basit priority hesabı:

```txt
priority = onboarding_theme_weight × content_theme_weight
```

Örnek:

```txt
fork onboarding weight = 10
riddle fork weight = 10

priority = 100
```

Bu riddle feed’de daha öne çıkar.

---

## Sonuç

`content_themes.weight` kalmalı.

Çünkü şu ayrımı yapmamızı sağlar:

```txt
ana tema
ikincil tema
bağlamsal tema
fallback tema
```

Kısa özet:

```txt
content_themes.weight = içerik ile theme arasındaki bağın gücü
onboarding_option_themes.weight = kullanıcının cevabı ile theme arasındaki bağın gücü
difficulty = içeriğin zorluğu
sort_order = UI/admin sıralaması
```

Bu alanlar farklı amaçlara hizmet eder ve birbirine karıştırılmamalıdır.
