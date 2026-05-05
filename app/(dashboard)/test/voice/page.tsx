import { TTSController } from "@/features/tts/components/tts-controller/tts-controller";

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Chessvolt Voice Test</h1>
      <TTSController text="White develops the knight and prepares kingside castling." />
    </div>
  );
}
