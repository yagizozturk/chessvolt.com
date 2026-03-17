import { TrophyIcon, X } from "lucide-react";

type BoardStatusIconProps = {
  status: "solved" | "wrong";
};

export function BoardStatusIcon({ status }: BoardStatusIconProps) {
  if (status === "solved") {
    return (
      <div className="absolute right-2 top-2 z-10 rounded-full bg-green-500 p-2 dark:bg-green-600">
        <TrophyIcon className="h-7 w-7 text-white" />
      </div>
    );
  }
  return (
    <div className="absolute right-2 top-2 z-10 rounded-full bg-red-500 p-2 dark:bg-red-600">
      <X className="h-7 w-7 text-white" />
    </div>
  );
}
