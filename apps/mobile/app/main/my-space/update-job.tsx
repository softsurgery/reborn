import { JobUpdateForm } from "@/components/jobs/forms/JobUpdateForm";
import { useLocalSearchParams } from "expo-router";

export default function Screen() {
  const { id } = useLocalSearchParams();
  return <JobUpdateForm id={id as string} />;
}
