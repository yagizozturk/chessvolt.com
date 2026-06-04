export default function AnimatePage() {
  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        Shadcn bileşeni buraya
      </div>
      <div>
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
        </span>
      </div>
    </>
  );
}
