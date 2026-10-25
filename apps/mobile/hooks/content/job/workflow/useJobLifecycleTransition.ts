import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { useTranslation } from "react-i18next";
import { JobEvents, ServerErrorResponse } from "@/types";
import { useNextWorkflowJob } from "./useNextWorkflowJob";
import { useWorkflowJob } from "./useWorkflowJob";

export const useJobLifecycleTransition = (id: string) => {
  const { t } = useTranslation("jobs");
  const queryClient = useQueryClient();
  const { refetchJobWorkflow } = useWorkflowJob({ id, enabled: !!id });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["job", id] });
    queryClient.invalidateQueries({ queryKey: ["job-workflow", id] });
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
    queryClient.invalidateQueries({ queryKey: ["job-metadata", id] });
    refetchJobWorkflow();
  }, [id, queryClient, refetchJobWorkflow]);

  const { nextJobWorkflow, isNextJobWorkflowPending } = useNextWorkflowJob({
    id,
    onSuccess: () => {
      invalidate();
      toast.success(t("management.lifecycle.toast.success"));
    },
    onError: (error) => {
      const serverError = error as ServerErrorResponse;
      toast.error(
        serverError?.response?.data?.message ||
          t("management.actions.errors.unknown"),
      );
    },
  });

  const runEvent = useCallback(
    (event: JobEvents) => nextJobWorkflow(event),
    [nextJobWorkflow],
  );

  return { runEvent, isPending: isNextJobWorkflowPending, invalidate };
};
