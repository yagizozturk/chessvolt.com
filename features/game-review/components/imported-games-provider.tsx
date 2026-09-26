"use client"; // Next.js: Bu dosya state ve hook kullanan bir Client Component siniri tanimlar.
import {
  // Ekrana yansiyacak veriyi tutar; setter ile degistirilmesi render tetikleyebilir.
  type ReactNode, // children icin tip: React'in gosterebildigi bilesen, metin vb. icerikler.
  createContext,
  // Verileri alt bilesenlerle paylasacak context'i olusturur.
  useCallback,
  // Bagimliliklar degismedikce ayni fonksiyon referansini kullanir; sonucu saklamaz.
  useContext,
  // En yakin ust Provider'in paylastigi degeri okur.
  useMemo,
  // Bir hesaplamanin sonucunu bagimliliklari degismedikce yeniden kullanir.
  useRef,
  // Render'lar arasinda deger saklar; current degisince render baslatmaz.
  useState,
} from "react";

import { requestImportedGames } from "@/features/game-review/api/imported-games";
// Oyunlari isteyen API fonksiyonu.
import type {
  ImportedGame,
  // Tek bir oyunun veri yapisi; bu import sadece TypeScript icindir.
  ImportedGamePlatform, // Desteklenen platform adlarinin tipi: chesscom veya lichess.
} from "@/features/game-review/types/imported-game";
import { useProfile } from "@/features/profile/hooks/use-profile";

// Profilde kayitli kullanici adlarini okumak icin.

type PlatformStatus = "idle" | "loading" | "success" | "error"; // Beklemede, yukleniyor, basarili veya hatali.

type ImportedGamesContextValue = {
  // useImportedGames() ile disariya sunacagimiz alanlarin tipleri.
  chesscomUsername: string; // Chess.com input'unda gosterilecek ad.
  lichessUsername: string; // Lichess input'unda gosterilecek ad.
  setChesscomUsername: (value: string) => void; // Formdaki Chess.com adini degistirir; profili kaydetmez.
  setLichessUsername: (value: string) => void; // Formdaki Lichess adini degistirir; istek baslatmaz.
  chesscomGames: ImportedGame[]; // Yuklenen Chess.com oyunlari.
  lichessGames: ImportedGame[]; // Yuklenen Lichess oyunlari.
  games: ImportedGame[]; // Iki platformun birlestirilmis oyun listesi.
  chesscomError: string | null; // Chess.com hata mesaji; null ise hata yok.
  lichessError: string | null; // Lichess hata mesaji; null ise hata yok.
  chesscomStatus: PlatformStatus; // Chess.com yukleme durumu.
  lichessStatus: PlatformStatus; // Lichess yukleme durumu.
  isChesscomLoading: boolean; // Chess.com butonunun spinner ve disabled durumunda kullanilir.
  isLichessLoading: boolean; // Lichess butonunun spinner ve disabled durumunda kullanilir.
  isLoading: boolean; // Platformlardan en az biri yukleniyorsa true.
  loadChesscom: () => Promise<void>; // Asenkron yukler; oyunlari return etmek yerine state'e yazar.
  loadLichess: () => Promise<void>; // Yalnizca Lichess icin yukleme baslatir.
  findGame: (platform: ImportedGamePlatform, id: string) => ImportedGame | undefined; // Platform ve id ile arar; bulunamazsa undefined doner.
};

const ImportedGamesContext = createContext<ImportedGamesContextValue | null>(null); // Provider yoksa okunacak varsayilan deger null.

function errorMessage(error: unknown, fallback: string): string {
  // Farkli hata bicimlerinden mesaj cikarmaya calisir.
  if (error && typeof error === "object" && "error" in error) {
    // null olmayan ve error alani bulunan nesne mi?
    return String(error.error) || fallback; // API'nin error alanini metne cevirir; bos metinse yedek mesaji kullanir.
  }
  if (error instanceof Error) return error.message || fallback; // Standart JavaScript hatasinin mesajini alir.
  return fallback; // Tanimadigimiz hata biciminde genel mesaji kullanir.
}

async function fetchPlatform( // Iki yukleme fonksiyonunun kullandigi ortak API yardimcisi; state degistirmez.
  platform: ImportedGamePlatform, // Hangi platformdan oyun istenecegi.
  username: string, // load fonksiyonunun trim() ile temizledigi ad.
): Promise<{ games: ImportedGame[]; error: string | null }> {
  // Sonuc her zaman games ve error alanlari tasir.
  try {
    // Istek hata firlatirsa catch bolumune gecilir.
    const response = await requestImportedGames(platform, username); // Bu istegin sonucunu bekler; diger platformu engellemez.
    if (!response.success || !response.data) {
      // API basarisiz demisse veya veri yoksa hata sonucu hazirlar.
      return { games: [], error: response.error || "Failed to load games" }; // API mesaji yoksa genel hata mesaji.
    }
    return { games: response.data, error: null }; // Basarili sonuc; bos bir oyun dizisi de basarili sayilir.
  } catch (error) {
    // Ornegin ag hatasi nedeniyle Promise reddedilirse buraya gelir.
    return { games: [], error: errorMessage(error, "Failed to load games") }; // Firlatilan hatayi ortak sonuc bicimine cevirir.
  }
}

export function ImportedGamesProvider({ children }: { children: ReactNode }) {
  // children: Provider'in icine yerlestirilen icerik.
  const { profile } = useProfile(); // Profil adlarini varsayilan olarak kullanir; bu satir oyun yuklemez.

  const [chesscomOverride, setChesscomOverride] = useState<string | null>(null); // null: kullanici henuz formda farkli bir deger belirtmedi.
  const [lichessOverride, setLichessOverride] = useState<string | null>(null); // Kullanici yazinca profil adinin yerine bu deger kullanilir.
  const [chesscomGames, setChesscomGames] = useState<ImportedGame[]>([]); // Baslangicta bos Chess.com listesi.
  const [lichessGames, setLichessGames] = useState<ImportedGame[]>([]); // Lichess listesi bagimsiz tutulur.
  const [chesscomError, setChesscomError] = useState<string | null>(null); // Baslangicta Chess.com hatasi yok.
  const [lichessError, setLichessError] = useState<string | null>(null); // Lichess hatasi diger platformu etkilemez.
  const [chesscomStatus, setChesscomStatus] = useState<PlatformStatus>("idle"); // Chess.com henuz yuklenmiyor.
  const [lichessStatus, setLichessStatus] = useState<PlatformStatus>("idle"); // Lichess henuz yuklenmiyor.

  const chesscomRequestId = useRef(0); // Son Chess.com yukleme cagrisi icin sayac; degismesi render baslatmaz.
  const lichessRequestId = useRef(0); // Ayri sayac sayesinde iki platform birbirinin sonucunu gecersiz kilmaz.

  const chesscomUsername = chesscomOverride ?? profile?.chesscomUsername ?? ""; // Once form degeri, yoksa profil adi, o da yoksa bos metin.
  const lichessUsername = lichessOverride ?? profile?.lichessUsername ?? ""; // ?? sadece null/undefined icin ilerler; input'u silince "" korunur.

  const loadChesscom = useCallback(async () => {
    // Fonksiyonu tanimlar; istek ancak form bu fonksiyonu cagirinca baslar.
    const requestId = ++chesscomRequestId.current; // Sayaci artirir ve bu cagrinin numarasini saklar; onceki cagrilar artik eskidir.
    const username = chesscomUsername.trim(); // Kullanici adinin basindaki ve sonundaki bosluklari siler.

    if (!username) {
      // Bos ya da sadece bosluklardan olusan adla API'ye gitmez.
      setChesscomGames([]); // Yalnizca Chess.com listesini temizler.
      setChesscomError(null); // Eski hata mesajini kaldirir.
      setChesscomStatus("idle"); // Durumu beklemeye alir.
      return; // Bu yukleme cagrisini burada bitirir.
    }

    setChesscomError(null); // Yeni deneme baslarken onceki hata mesajini temizler.
    setChesscomStatus("loading"); // Chess.com spinner'i acilir; mevcut oyunlar sonuc gelene kadar kalir.

    const result = await fetchPlatform("chesscom", username); // Yalnizca Chess.com sonucunu bekler.
    if (requestId !== chesscomRequestId.current) return; // Daha yeni cagri varsa bu eski yaniti yok sayar; ag istegini iptal etmez.

    setChesscomGames(result.games); // Yeni oyunlari kaydeder; hata sonucundaki bos dizi eski listeyi temizler.
    setChesscomError(result.error); // Varsa hata mesajini, yoksa null kaydeder.
    setChesscomStatus(result.error ? "error" : "success"); // Sonuca gore durum belirlenir ve loading biter.
  }, [chesscomUsername]); // Ad degisince fonksiyon yeni adi kullanir; bu degisiklik otomatik istek baslatmaz.

  const loadLichess = useCallback(async () => {
    // Lichess formunun cagiracagi bagimsiz yukleme fonksiyonu.
    const requestId = ++lichessRequestId.current; // Bu Lichess cagrisini en guncel cagri olarak isaretler.
    const username = lichessUsername.trim(); // Adin iki ucundaki bosluklari temizler.

    if (!username) {
      // Ad bossa Lichess durumunu sifirlar; Chess.com'a dokunmaz.
      setLichessGames([]); // Lichess oyunlarini temizler.
      setLichessError(null); // Lichess hata mesajini temizler.
      setLichessStatus("idle"); // Durumu beklemeye alir.
      return; // API istegi gondermeden bitirir.
    }

    setLichessError(null); // Onceki denemenin hata mesajini kaldirir.
    setLichessStatus("loading"); // Yalnizca Lichess yukleniyor durumuna gecer.

    const result = await fetchPlatform("lichess", username); // Lichess API sonucunu bekler.
    if (requestId !== lichessRequestId.current) return; // Bu sirada yeni Lichess cagrisi yapildiysa eski sonucu uygulamaz.

    setLichessGames(result.games); // Gelen Lichess oyunlarini state'e yazar.
    setLichessError(result.error); // Son hata durumunu kaydeder.
    setLichessStatus(result.error ? "error" : "success"); // Yukleme biter; hata veya basari durumuna gecer.
  }, [lichessUsername]); // Fonksiyon referansi kullanici adi degistiginde yenilenir.

  const games = useMemo(
    // Birlestirilmis listeyi ayri bir state olarak tutmak yerine mevcut listelerden hesaplar.
    () => [...chesscomGames, ...lichessGames], // Once Chess.com, sonra Lichess oyunlari; tarihe gore siralama yapmaz.
    [chesscomGames, lichessGames], // Listelerden birinin referansi degistiginde yeniden birlestirir.
  );

  const findGame = useCallback(
    // Yuklenmis oyunlar icinde arama fonksiyonu; API'ye gitmez.
    (platform: ImportedGamePlatform, id: string) => games.find((game) => game.platform === platform && game.id === id), // Iki alan da eslesmeli; bulunamazsa undefined doner.
    [games], // Oyun listesi degisince arama fonksiyonu guncel listeyi kullanir.
  );

  const value = useMemo<ImportedGamesContextValue>( // Bagimliliklar ayniyken ayni context nesnesini kullanir; tip, alanlari derlemede kontrol eder.
    () => ({
      // useImportedGames() cagiran bilesenlerin alacagi ortak nesne.
      chesscomUsername, // Hesaplanan guncel Chess.com adi.
      lichessUsername, // Hesaplanan guncel Lichess adi.
      setChesscomUsername: setChesscomOverride, // Icerideki setter'i forma daha anlamli bir adla sunar.
      setLichessUsername: setLichessOverride, // Input degisikligi override state'ine yazilir; profil degistirilmez.
      chesscomGames, // Chess.com listesine erisim.
      lichessGames, // Lichess listesine erisim.
      games, // Birlesik listeye erisim.
      chesscomError, // Chess.com hata mesajina erisim.
      lichessError, // Lichess hata mesajina erisim.
      chesscomStatus, // Chess.com durumuna erisim.
      lichessStatus, // Lichess durumuna erisim.
      isChesscomLoading: chesscomStatus === "loading", // Ayrica state tutmadan durumdan boolean turetir.
      isLichessLoading: lichessStatus === "loading", // Lichess butonunun kullanacagi yukleme bilgisi.
      isLoading: chesscomStatus === "loading" || lichessStatus === "loading", // Genel liste icin: en az biri yukleniyor mu?
      loadChesscom, // Chess.com butonunun cagiracagi fonksiyon.
      loadLichess, // Lichess butonunun cagiracagi fonksiyon.
      findGame, // Platform ve id ile oyun bulma fonksiyonu.
    }),
    [
      // Bu deger veya referanslardan biri degisince value yeniden olusturulur.
      chesscomUsername,
      lichessUsername,
      chesscomGames,
      lichessGames,
      games,
      chesscomError,
      lichessError,
      chesscomStatus,
      lichessStatus,
      loadChesscom,
      loadLichess,
      findGame,
    ],
  );

  return (
    // Hazirlanan value nesnesini bu Provider'in altindaki bilesenlere sunar.
    <ImportedGamesContext.Provider value={value}>{children}</ImportedGamesContext.Provider>
  );
}

export function useImportedGames() {
  // Form, liste ve kartlarin ortak verilere erismek icin kullandigi hook.
  const context = useContext(ImportedGamesContext); // En yakin ImportedGamesProvider'in value degerini okur; degisikliklere abone olur.
  if (!context) {
    // Ust agacta bu Provider yoksa varsayilan null gelir.
    throw new Error("useImportedGames must be used within ImportedGamesProvider"); // Yanlis yerlesimi acik bir hata ile bildirir.
  }
  return context; // Kullanici adlari, listeler, durumlar ve yukleme fonksiyonlarini bilesene verir.
}
