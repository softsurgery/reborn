import { useMutation } from "@tanstack/react-query";
import { showToastable } from "react-native-toastable";
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
    showToastable({
      message: error.response?.data.message,
      status: "danger",
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
