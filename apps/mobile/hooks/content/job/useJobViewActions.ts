import { useMutation } from "@tanstack/react-query";
import { showToastable } from "react-native-toastable";
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
    showToastable({
      message: error.response?.data.message,
      status: "danger",
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
