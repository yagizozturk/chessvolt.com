// TODO: Refactor
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsFromDisplayName } from "@/features/profile/utilities/user-avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  avatarUrl?: string | null;
  displayName: string;
  className?: string;
  fallbackClassName?: string;
  size?: "default" | "sm" | "lg";
};

export function UserAvatar({ avatarUrl, displayName, className, fallbackClassName, size }: UserAvatarProps) {
  const initials = getInitialsFromDisplayName(displayName);

  return (
    <Avatar size={size} className={cn("shrink-0", className)}>
      {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
      <AvatarFallback className={cn("text-xs font-semibold", fallbackClassName)}>{initials}</AvatarFallback>
    </Avatar>
  );
}
