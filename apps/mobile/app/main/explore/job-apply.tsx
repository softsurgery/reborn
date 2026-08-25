import { JobApply } from "@/components/jobs/requests/form/JobApply";
import { useLocalSearchParams } from "expo-router";

export default function Screen() {
  const { id } = useLocalSearchParams();

  return <JobApply id={id as string} />;
}
