import { useDialog } from "@reborn/components";
import { Spinner } from "@reborn/components";
import { Button } from "@reborn/ui";
import { useTranslation } from "@reborn/i18n";

interface JobDeleteDialogProps {
  representation?: string;
  deleteJob?: () => void;
  isDeletePending?: boolean;
}

export const useJobDeleteDialog = ({
  representation,
  deleteJob,
  isDeletePending,
}: JobDeleteDialogProps) => {
  const { t: tJob } = useTranslation("job");
  const { t: tCommon } = useTranslation("common");
  const {
    DialogFragment: deleteJobDialog,
    openDialog: openDeleteJobDialog,
    closeDialog: closeDeleteJobDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tJob("job.dialog.deleteTitle")} <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: tJob("job.dialog.deleteDescription"),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteJob?.();
              closeDeleteJobDialog();
            }}
          >
            {tCommon("common.buttons.delete")}
            <Spinner show={isDeletePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDeleteJobDialog();
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
    deleteJobDialog,
    openDeleteJobDialog,
    closeDeleteJobDialog,
  };
};
