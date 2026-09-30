export function formatPlayedAt(endTime: number): string {
  if (!endTime) return "";
  const playedDate = new Date(endTime * 1000);
  const month = playedDate.toLocaleDateString(undefined, { month: "short" });

  return `${playedDate.getDate()} ${month}`;
}
