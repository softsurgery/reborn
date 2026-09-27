import { JobRequestUpdate } from "@/components/jobs/requests/form/JobRequestUpdate";
import { useLocalSearchParams } from "expo-router";

export default function Screen() {
  const { id } = useLocalSearchParams();

  return <JobRequestUpdate id={id as string} />;
}
