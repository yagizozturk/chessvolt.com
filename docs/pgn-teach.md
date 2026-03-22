Tek katmanlı (flat) PGN yapısı hem veri yönetimi hem de kullanıcıyı boğmamak adına çok mantıklı bir tercih. "Derinlik ve genişlik" dengesini kurmak için şu 3 temel kriteri baz alabilirsin:

### 1. "Popülarite" (Database) Kriteri

Hangi yan yola (sideline) bakacağına karar verirken en güvenilir kaynak **Lichess Master** veya **Chess.com** veritabanlarıdır.

- **Kural:** Eğer bir yan hamle (sideline), ana hattan sonra en çok oynanan 2. veya 3. hamleyse (ve oynanma oranı %10-15'in üzerindeyse), o hamleye mutlaka bakmalısın.
- **Kaç tane?** Bir varyant içinde genellikle en popüler **2 ana yan yolu** incelemek yeterlidir.

### 2. "Tehlike ve Karakter" Kriteri

Bazı hamleler çok popüler değildir ama çok tehlikelidir (tuzaklar veya keskin gambitler).

- **Kural:** Eğer bir yan hamle "Stockfish" tarafından çok düşük puan alıyor ama pratik oyunda (blitz/bullet) beyazların kazanma oranı çok yüksekse, bu bir "tuzaklı" yoldur. Kullanıcıya bunu öğretmelisin.
- **Kaç tane?** Sadece 1 adet "kritik tuzak" varyantı eklemek dersin kalitesini artırır.

### 3. "Derinlik" (Kaç Hamle Sonrasına Bakmalı?)

Derinliği belirlerken "Taş Değişimi" veya "Stratejik Netlik" noktasına kadar gitmelisin.

- **Ana Hat (Main Line):** Genelde 12-15. hamleye kadar, yani oyunun karakterinin (izole piyon, rok yönü vb.) netleştiği yere kadar gidilir.
- **Yan Hamleler (Sidelines):** Yan hamlelerde o kadar derine gitmene gerek yok. Rakibin yaptığı o spesifik yan hamlenin **neden hata olduğunu** veya **nasıl dengelendiğini** gösteren 3-5 hamlelik bir seri (genelde 8-10. hamle civarı) yeterlidir.

### Özet Formül (Pratik Uygulama)

Bir açılış dersini şu şablona göre "tek katmanlı" PGN'lere bölebilirsin:

1.  **Main Line PGN:** 15 hamle (En sağlam yol).
2.  **Sideline A PGN:** 8-10 hamle (En popüler 2. hamle).
3.  **Sideline B PGN:** 8-10 hamle (En popüler 3. hamle).
4.  **Trap/Gambit PGN:** 6-8 hamle (Tehlikeli ama yanlış olan yol).

### Nasıl Bulursun? (Araç Önerisi)

- **Lichess Analysis Board:** Sağ taraftaki "Opening Explorer"ı aç. Oradaki hamle yüzdeleri sana hangi yan yola bakman gerektiğini doğrudan söyler.
- **Stockfish:** Yan hamlelerin derinliğini belirlerken, motorun değerlendirmesi (eval) +1.0 veya -1.0 gibi net bir üstünlüğe ulaştığı anda varyantı kesebilirsin. Bu, "ders burada biter, artık üstünsün" demektir.

Bu yöntemle hazırladığın içerik, kullanıcıyı detaylarda boğmadan açılışın ruhunu öğretir. Belirli bir varyant için sayısal bir örnek istersen (mesela Caro-Kann Advance) birlikte kurgulayabiliriz.
