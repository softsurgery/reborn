import { View } from "react-native";
import Select from "../shared/Select";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";
import { Label } from "../ui/label";
import { Text } from "../ui/text";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const preferencePersistStore = usePreferencePersistStore();
  const { t, i18n } = useTranslation("common");
  return (
    <View
      className={cn("flex-row items-center justify-between gap-2", className)}
    >
      <View className="flex flex-col items-start flex-1">
        <Label className="text-2xl font-bold">{t("language")}</Label>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {t("select_language")}
        </Text>
      </View>
      <View className={cn("w-1/2")}>
        <Select
          className="w-full"
          title={t("language")}
          description={t("select_language").toString()}
          value={preferencePersistStore.language}
          onSelect={(value) => {
            i18n.changeLanguage(value);
            preferencePersistStore.setLanguage(value as "en" | "fr" | "ar");
          }}
          options={[
            { label: "English", value: "en" },
            { label: "Français", value: "fr" },
            { label: "Arabic", value: "ar" },
          ]}
        />
      </View>
    </View>
  );
};
