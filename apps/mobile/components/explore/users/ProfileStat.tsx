import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { useClientStore } from "~/hooks/stores/useClientStore";
import { cn } from "~/lib/utils";
import { UserEntry } from "./UserEntry";
import { StableScrollView } from "~/components/shared/StableScrollView";

interface ProfileStatProps {
  className?: string;
}

export const ProfileStat = ({ className }: ProfileStatProps) => {
  const clientStore = useClientStore();
  return (
    <View
      className={cn(
        "flex flex-row w-full items-center justify-between",
        className
      )}
    >
      {/* Services */}
      <Dialog>
        <DialogTrigger asChild>
          <StablePressable
            className="flex flex-col items-center"
            onPressClassname="opacity-70"
          >
            <Text variant={"large"}>-</Text>
            <Text variant={"muted"}>Services</Text>
          </StablePressable>
        </DialogTrigger>
        <DialogContent className="w-[90vw]">
          <DialogHeader>
            <DialogTitle>Services</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Following */}
      <Dialog>
        <DialogTrigger asChild>
          <StablePressable
            className="flex flex-col items-center "
            onPressClassname="opacity-70"
          >
            <Text variant={"large"}>
              {clientStore.responseFollowCountsDto?.following}
            </Text>
            <Text variant={"muted"}>Following</Text>
          </StablePressable>
        </DialogTrigger>
        <DialogContent className="w-[90vw] min-h-[50vh] py-0">
          <StableScrollView className="flex flex-col">
            {clientStore.following.map((f) => {
              return (
                <UserEntry key={f.id} user={f.following} className="mt-4" />
              );
            })}
          </StableScrollView>
        </DialogContent>
      </Dialog>

      {/* Followers */}
      <Dialog>
        <DialogTrigger asChild>
          <StablePressable
            className="flex flex-col items-center"
            onPressClassname="opacity-70"
          >
            <Text variant={"large"}>
              {clientStore.responseFollowCountsDto?.followers}
            </Text>
            <Text variant={"muted"}>Followers</Text>
          </StablePressable>
        </DialogTrigger>
        <DialogContent className="w-[90vw] min-h-[50vh] py-0">
          <StableScrollView className="flex flex-col">
            {clientStore.followers.map((f) => (
              <UserEntry key={f.id} user={f.follower} className="mt-4" />
            ))}
          </StableScrollView>
        </DialogContent>
      </Dialog>
    </View>
  );
};
