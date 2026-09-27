import { useLocalSearchParams } from "expo-router";
import { InspectProfile } from "~/components/profile/InspectProfile";

export default function Screen() {
  const { id } = useLocalSearchParams();
  return <InspectProfile id={id as string} />;
}
