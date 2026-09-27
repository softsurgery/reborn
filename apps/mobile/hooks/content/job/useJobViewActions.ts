import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { api } from "~/api";
import { ServerErrorResponse } from "~/types";

interface useJobSaveActionsProps {
  onSuccess?: (...args: any) => void;
  onError?: (...args: any) => void;
}

export const useJobViewActions = ({
  onSuccess,
  onError,
}: useJobSaveActionsProps) => {
  const defaultOnError = (error: ServerErrorResponse) => {
    toast.error("Oops! Failed to perform action", {
      description: error.response?.data?.message || "Please try again later.",
    });
  };

  const { mutate: viewJob, isPending: isViewPending } = useMutation({
    mutationFn: (id: string) => api.jobView.create({ jobId: id }),
    onSuccess,
    onError: onError ? onError : defaultOnError,
  });

  return {
    viewJob,
    isViewPending,
  };
};
