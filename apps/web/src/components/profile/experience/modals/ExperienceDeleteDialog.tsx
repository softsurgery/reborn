import { useDialog } from "@reborn/components";
import { Spinner } from "@reborn/components";
import { Button } from "@reborn/ui";
import { useTranslation } from "@reborn/i18n";

interface ExperienceDeleteDialogProps {
  experienceTitle?: string;
  deleteExperience?: () => void;
  isDeletePending?: boolean;
}

export const useExperienceDeleteDialog = ({
  experienceTitle,
  deleteExperience,
  isDeletePending,
}: ExperienceDeleteDialogProps) => {
  const { t } = useTranslation("user-management");
  const { t: tCommon } = useTranslation("common");
  const {
    DialogFragment: experienceDeleteDialog,
    openDialog: openExperienceDeleteDialog,
    closeDialog: closeExperienceDeleteDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.experience.dialogs.deleteTitle")}{" "}
        <span className="font-light">{experienceTitle}</span> ?
      </div>
    ),
    description: (
      <div>{t("userManagement.experience.dialogs.deleteDescription")}</div>
    ),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteExperience?.();
              closeExperienceDeleteDialog();
            }}
          >
            {tCommon("common.buttons.delete")}
            <Spinner show={isDeletePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeExperienceDeleteDialog();
            }}
          >
            {tCommon("common.buttons.cancel")}
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
  });

  return {
    experienceDeleteDialog,
    openExperienceDeleteDialog,
    closeExperienceDeleteDialog,
  };
};
