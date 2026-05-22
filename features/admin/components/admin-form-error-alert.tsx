type Props = {
  message: string | null;
};

export function AdminFormErrorAlert({ message }: Props) {
  if (!message) return null;
  return (
    <div
      className="border-destructive/50 bg-destructive/10 text-destructive mb-4 rounded-md border p-3 text-sm"
      role="alert"
    >
      {message}
    </div>
  );
}
