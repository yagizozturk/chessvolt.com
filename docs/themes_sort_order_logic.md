# Chessvolt `themes.sort_order` Mantığı

`themes.sort_order` alanı hesaplama için değil, sadece sıralama için kullanılır.

## Neden var?

Theme listesini UI’da veya admin panelde alfabetik değil, pedagojik sıraya göre göstermek için kullanılır.

Örnek sıra:

```txt
Basics
Tactics
Mate Patterns
Opening
Positional
Endgame
```

## Neden 10, 100, 200, 400 gibi değerler var?

Bu değerler özel bir anlam taşımaz. Sadece araya sonradan yeni theme ekleyebilmek için boşluk bırakılmıştır.

Örnek:

```txt
basics          10-99
tactics         100-199
mate_patterns   200-299
opening         300-399
positional      400-499
endgame         500-599
```

## Örnek

```txt
mate_patterns       200
mate_in_1           210
mate_in_2           220
back_rank_mate      230
```

Sonradan araya yeni bir theme eklemek istersek:

```txt
arabian_mate        225
```

şeklinde ekleyebiliriz.

## Zorunlu mu?

Hayır, zorunlu değil.

Ama admin panelde ve kullanıcıya gösterilen listelerde düzenli bir sıralama sağlamak için faydalı.

## Kısa özet

```txt
sort_order = UI/admin sıralaması
difficulty = içerik zorluğu
weight = theme ilişkisinin gücü
```

Bu üç alan birbirine karıştırılmamalı.
