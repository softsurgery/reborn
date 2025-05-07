import { Search } from "lucide-react-native";
import { View } from "react-native";
import Icon from "~/lib/Icon";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { Separator } from "../ui/separator";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SearchInput } from "../common/SearchInput";
import { HomePageHeader } from "./HomePageHeader";
import { JobCard } from "./JobCard";

export const HomePage = () => {
  return (
    <KeyboardAwareScrollView>
      <HomePageHeader />
      <JobCard />
    </KeyboardAwareScrollView>
  );
};
