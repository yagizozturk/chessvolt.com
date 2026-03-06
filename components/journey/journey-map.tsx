type Chapter = {
  name: string;
  completed: boolean;
};

type Props = {
  chapters: Chapter[];
};

export const JourneyMap = ({ chapters }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      {chapters.map((chapter, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
            chapter.completed
              ? "bg-green-500/20 text-green-400"
              : "bg-tertiary/5 text-secondary/60"
          }`}
        >
          <span className="w-6 font-bold">{index + 1}</span>
          <span>{chapter.name}</span>
        </div>
      ))}
    </div>
  );
};
