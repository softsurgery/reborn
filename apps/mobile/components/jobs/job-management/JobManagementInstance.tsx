import { StableSafeAreaView } from "@/components/shared/StableSafeAreaView";
import { Text } from "@/components/ui/text";

interface JobManagementInstanceProps {
  id: string;
  className?: string;
}

export const JobManagementInstance = ({
  id,
  className,
}: JobManagementInstanceProps) => {
  return (
    <StableSafeAreaView className={className}>
      <Text>Job Management Instance for Job ID: {id}</Text>
    </StableSafeAreaView>
  );
};
