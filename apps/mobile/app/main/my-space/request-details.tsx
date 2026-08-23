import { useLocalSearchParams } from "expo-router";
import { RequestDetails } from "@/components/home/my-space/requests/RequestDetails";

export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <RequestDetails id={id as string} />;
}
