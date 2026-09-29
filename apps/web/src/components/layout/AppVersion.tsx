import { Label } from "@reborn/ui";
import { cn } from "@reborn/lib";

interface AppVersionProps {
  className?: string;
}

export const AppVersion = ({ className }: AppVersionProps) => {
  return (
    <div className={cn("truncate", className)}>
      <Label className="text-xs">V{process.env.NEXT_PUBLIC_APP_VERSION}</Label>
    </div>
  );
};
