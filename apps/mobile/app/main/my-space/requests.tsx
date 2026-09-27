import { useLocalSearchParams } from "expo-router";
import { Requests } from "@/components/jobs/requests/Requests";

export default function Screen() {
  const { variant } = useLocalSearchParams();

  return <Requests initialTab={variant as "incoming" | "outgoing"} />;
}
