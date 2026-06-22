import { JobDetails } from "@/components/jobs/job-details/JobDetails";
import { useLocalSearchParams } from "expo-router";

export default function Screen() {
  const { id } = useLocalSearchParams();

  return <JobDetails id={id as string} />;
}
