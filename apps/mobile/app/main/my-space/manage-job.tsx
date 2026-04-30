import { JobManagementPortal } from "@/components/jobs/job-management/JobManagementPortal";
import { useLocalSearchParams } from "expo-router";

export default function Screen() {
  const { id } = useLocalSearchParams();
  return <JobManagementPortal id={id as string} />;
}
