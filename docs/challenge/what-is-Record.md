TypeScript projelerinde sıkça karşılaştığın `Record<K, V>`, aslında bir **nesne (object) tipi tanımlamanın** en temiz ve kısa yoludur.

Senin kodundaki `Record<string, GameRiddle[]>`, TypeScript'e şunu söyler:

> "Bu bir nesnedir; içindeki **anahtarlar (key)** `string` tipindedir, bu anahtarların karşısındaki **değerler (value)** ise birer `GameRiddle` dizisidir."

---

### Neden Düz `Object` Yazmıyoruz?

Eğer `Record` kullanmasaydın, aynı yapıyı şu şekilde tanımlaman gerekecekti:
`{ [key: string]: GameRiddle[] }`

`Record` kullanmanın avantajları şunlardır:

- **Okunabilirlik:** "Bu bir kayıt (record) listesidir" ifadesi kodun amacını daha iyi açıklar.
- **Esneklik:** Anahtar kısmına sadece `string` değil, belirli bir "Union Type" da verebilirsin. Örneğin:
  `Record<'easy' | 'hard', GameRiddle[]>` dersen, TypeScript seni sadece bu iki anahtarı kullanmaya zorlar.

### Senin Kodundaki Akış

Kodun tam olarak şunu yapıyor:

1. **Boş bir sözlük oluşturuyor:** `groups` adında, anahtarları oyun tipi olan bir nesne başlatıyor.
2. **Gruplama:** Bilmeceleri geziyor, her birini kendi `gameType` başlığı altına (bir dizi içine) yerleştiriyor.
3. **Dönüş Tipi:** Fonksiyonun sonunda elinde şöyle bir yapı oluşuyor:

```json
{
  "bulmaca": [ { "ply": 1, ... }, { "ply": 5, ... } ],
  "matematik": [ { "ply": 2, ... } ],
  "uncategorized": [ ... ]
}

```

### Özetle

`Record` burada bir **sözlük (Dictionary)** yapısı kurmanı sağlıyor. "Oyun tipini ver (key), o tipe ait bilmeceleri (value) al" mantığıyla çalışıyor.

Bu fonksiyonun performansını artırmak veya `gameType` için bir `enum` kullanmak ister misin? Eklemeler yapabiliriz.

```ts
function groupRiddlesByGameType(
  riddles: GameRiddle[],
): Record<string, GameRiddle[]> {
  const groups: Record<string, GameRiddle[]> = {};

  for (const riddle of riddles) {
    const gameType = riddle.gameType?.trim() || "uncategorized";

    if (!groups[gameType]) {
      groups[gameType] = [];
    }
    groups[gameType].push(riddle);
  }

  return groups;
}
```


### Örnek Response

`groupRiddlesByGameType` fonksiyonunun döndürdüğü yapının gerçek bir örneği:

```json
{
  "legend_games": [
    {
      "id": "00eb6073-393f-41bd-8bc6-dc85ef920b3e",
      "gameId": "b52ab212-d8d7-44ca-bb0e-005a10735986",
      "ply": 1,
      "title": "The Evergreen Game",
      "moves": "e7e5 g1f3 b8c6 f1c4",
      "gameType": "legend_games",
      "createdAt": "2026-03-08T14:30:40.939833+00:00"
    },
    {
      "id": "ab5fe39e-180c-45a5-8b3f-efafc09df66a",
      "gameId": "e71c9d55-1af8-46ed-9cec-63e4fe53c3c4",
      "ply": 18,
      "title": "Find Morphy's brilliant finish",
      "moves": "c3b5 c6b5 c4b5 b8d7 e1c1 a8d8 d1d7 d8d7 h1d1 e7e6 b5d7 f6d7 b3b8 d7b8 d1d8",
      "gameType": "legend_games",
      "createdAt": "2026-03-07T13:19:17.680137+00:00"
    },
    {
      "id": "ba06b46d-d223-4ece-8f45-ebfd72a0e9a7",
      "gameId": "b7b3fb0b-b2d8-45a1-ae6c-2bc7cb104f1c",
      "ply": 45,
      "title": "Game against Kramnik",
      "moves": "e8f6 e2f4 d8e8",
      "gameType": "legend_games",
      "createdAt": "2026-03-03T15:00:46.772777+00:00"
    },
    {
      "id": "7210dc5e-51a1-4c6b-ac59-355ab1286a67",
      "gameId": "bfcf3c2c-6cf7-4f92-8121-75f22e98c498",
      "ply": 68,
      "title": "What did Magnus Carlsen play here?",
      "moves": "g3h5 g6h5 h4g5 f6g5 f1f7",
      "gameType": "legend_games",
      "createdAt": "2026-03-02T13:06:13.254463+00:00"
    }
  ]
}
```

