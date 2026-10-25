import { Input } from "@softsurgery/ui";
import { Button } from "@softsurgery/ui";
import { cn } from "@softsurgery/lib";

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
