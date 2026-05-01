import { JobManagementInstance } from "@/components/jobs/job-management/JobManagementInstance";
import { useLocalSearchParams } from "expo-router";

export default function Screen() {
  const { id } = useLocalSearchParams();
  return <JobManagementInstance id={id as string} />;
}
