import { useLocalSearchParams } from "expo-router";
import { RequestDetails } from "@/components/jobs/requests/details/RequestDetails";

export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <RequestDetails id={id as string} />;
}
