import { Input } from "@reborn/ui";
import { Button } from "@reborn/ui";
import { cn } from "@reborn/lib";

interface ResourcesActionBarProps {
  className?: string;
  openCreateResourceSheet?: () => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

export const ResourcesActionBar = ({
  className,
  searchTerm,
  openCreateResourceSheet,
  setSearchTerm,
}: ResourcesActionBarProps) => {
  return (
    <div
      className={cn(
        "flex flex-row justify-center items-center gap-4",
        className
      )}
    >
      <Input
        placeholder="Search resources"
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm?.(e.target.value)}
      />
      <Button
        variant="default"
        className="mb-4"
        onClick={openCreateResourceSheet}
      >
        Add Resource
      </Button>
    </div>
  );
};
