import { Button } from "@reborn/mobile-ui";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@reborn/mobile-ui";
import { Text } from "@reborn/mobile-ui";
import { cn } from "@reborn/lib";
import React from "react";
import { View } from "react-native";
import { useTranslation } from "@reborn/i18n";
import { UserStore } from "@/hooks/stores/useUserStore";

interface DeleteEducationDialogProps {
  userStore?: UserStore;
  trigger?: React.ReactNode;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
  handleDelete?: () => void;
}

export const DeleteEducationDialog = ({
  trigger,
  loading,
  handleDelete,
}: DeleteEducationDialogProps) => {
  const { t } = useTranslation("menu");
  const [visible, setVisible] = React.useState(false);

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogTrigger asChild>
        {trigger || (
          <Text className="text-red-500 text-sm font-semibold">
            {t("education.delete.trigger")}
          </Text>
        )}
      </DialogTrigger>

      <DialogContent className={cn("w-[90vw] rounded-lg")}>
        <DialogTitle>
          <Text className="text-lg font-semibold text-foreground">
            {t("education.delete.title")}
          </Text>
        </DialogTitle>

        <View className="flex flex-col gap-2">
          <Text className="text-sm text-muted-foreground">
            {t("education.delete.message")}
          </Text>
        </View>

        <View className="flex flex-row gap-3 justify-end">
          <Button
            variant="destructive"
            onPress={() => {
              handleDelete?.();
              setVisible(false);
            }}
            disabled={loading}
            className="flex-1"
          >
            <Text>
              {loading
                ? t("education.delete.actions.deletePending")
                : t("education.delete.actions.delete")}
            </Text>
          </Button>
          <Button
            variant="outline"
            onPress={() => setVisible(false)}
            disabled={loading}
            className="flex-1"
          >
            <Text>{t("education.delete.actions.cancel")}</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
};
