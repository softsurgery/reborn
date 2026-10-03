import { useTranslation } from "@reborn/i18n";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@reborn/ui";
import { Edit, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@reborn/ui";
import { Separator } from "@reborn/ui";

interface SettingsProps {
  className?: string;
}

export const Settings = ({ className }: SettingsProps) => {
  const { t } = useTranslation("settings");
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t("settings")}</CardTitle>
        <CardDescription>{t("manageAccount")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{t("account")}</h3>
          <p className="text-muted-foreground">
            {t("updateAccount")}
          </p>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            {t("editAccount")}
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">{t("privacy")}</h3>
          <p className="text-muted-foreground">{t("managePrivacy")}</p>
          <Button variant="outline" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            {t("privacySettings")}
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">{t("notifications")}</h3>
          <p className="text-muted-foreground">
            {t("configureNotifications")}
          </p>
          <Button variant="outline" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            {t("notificationSettings")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
