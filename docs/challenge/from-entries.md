`Object.fromEntries()`, elindeki bir **dizi listesini** (key-value çiftlerini) hızlıca bir **objeye** dönüştüren JavaScript fonksiyonudur.

Senin kodundaki senaryoda, iç içe dizilerden oluşan bir yapıyı alıp, sorgulaması çok daha kolay olan bir "sözlük" (dictionary) haline getiriyor.

---

### Nasıl Çalışır?

`map` fonksiyonun şu şekilde bir çıktı üretiyor:
`[['id1', true], ['id2', false], ['id3', true]]` (Yani dizi içinde diziler).

`Object.fromEntries` bu yapıyı alır ve şunu yapar:

| Giriş (Array of Arrays)       | Çıkış (Object)                |
| ----------------------------- | ----------------------------- |
| `['gameRiddleId', isCorrect]` | `{ gameRiddleId: isCorrect }` |

**Sonuçta ortaya çıkan obje şuna benzer:**

```javascript
{
  "riddle-101": true,
  "riddle-102": false,
  "riddle-103": true
}

```

---

### Neden Bunu Kullanıyoruz?

Normalde `attemptedRiddles` bir **dizidir**. Eğer bir bilmecenin çözülüp çözülmediğini kontrol etmek istersen, her seferinde dizinin içinde `find` veya `filter` ile arama yapman gerekir. Bu da performans kaybı demektir.

Ancak `Object.fromEntries` ile bunu bir objeye çevirdiğinde:

- **Hız:** Bir ID'nin değerine erişmek `O(1)` hızındadır (direkt adresten çağırma).
- **Kolaylık:** `attemptByRiddleId[riddleId]` yazarak sonucun `true` mu `false` mu olduğunu anında öğrenebilirsin.

### Örnek Kullanım Farkı

**Eskiden (Dizi varken):**

```javascript
const isCorrect = attemptedRiddles.find(
  (a) => a.gameRiddleId === "123",
)?.isCorrect;
```

**Şimdi (fromEntries sonrası):**

```javascript
const isCorrect = attemptByRiddleId["123"];
```

Bu yöntem özellikle binlerce veriyle uğraşırken kodun çok daha performanslı çalışmasını sağlar.

Bu dönüşümden sonra veriyi bir yerde filtrelemek mi istiyorsun yoksa direkt arayüzde mi göstereceksin? Ona göre optimize edebiliriz.
