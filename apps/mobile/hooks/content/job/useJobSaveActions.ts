import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { api } from "~/api";
import { ServerErrorResponse } from "~/types";

interface useJobSaveActionsProps {
  onSuccess?: (...args: any) => void;
  onError?: (...args: any) => void;
}

export const useJobSaveActions = ({
  onSuccess,
  onError,
}: useJobSaveActionsProps) => {
  const defaultOnError = (error: ServerErrorResponse) => {
    toast.error("Oops! Failed to perform action", {
      description: error.response?.data?.message || "Please try again later.",
    });
  };

  const { mutate: saveJob, isPending: isSavePending } = useMutation({
    mutationFn: (id: string) => api.jobSave.create({ jobId: id }),
    onSuccess,
    onError: onError ? onError : defaultOnError,
  });

  const { mutate: unsaveJob, isPending: isUnsavePending } = useMutation({
    mutationFn: (id: string) => api.jobSave.remove(id),
    onSuccess,
    onError: onError ? onError : defaultOnError,
  });

  return {
    saveJob,
    isSavePending,
    unsaveJob,
    isUnsavePending,
  };
};
