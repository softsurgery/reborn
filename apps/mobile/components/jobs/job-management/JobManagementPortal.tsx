import { StableSafeAreaView } from "@/components/shared/StableSafeAreaView";
import { Text } from "~/components/ui/text";

interface JobManagementPortalProps {
  id: string;
  className?: string;
}

export const JobManagementPortal = ({
  id,
  className,
}: JobManagementPortalProps) => {
  return (
    <StableSafeAreaView className={className}>
      <Text>Job Management Portal {id}</Text>
    </StableSafeAreaView>
  );
};
