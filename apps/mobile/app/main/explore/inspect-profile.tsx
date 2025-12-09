import { useLocalSearchParams } from "expo-router";
import { UserProfile } from "~/components/explore/users/UserProfile";
import { InspectProfile } from "~/components/profile/InspectProfile";

export default function Screen() {
  const { id } = useLocalSearchParams();
  return <InspectProfile id={id as string} />;
}
