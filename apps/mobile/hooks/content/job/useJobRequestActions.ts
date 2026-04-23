import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { api } from "~/api";
import { ServerErrorResponse } from "~/types";

interface useJobRequestActionsProps {
  onSuccess?: (...args: any) => void;
  onError?: (...args: any) => void;
}

export const useJobRequestActions = ({
  onSuccess,
  onError,
}: useJobRequestActionsProps) => {
  const defaultOnError = (error: ServerErrorResponse) => {
    toast.error("Oops! Failed to perform action", {
      description: error.response?.data?.message || "Please try again later.",
    });
  };
  const { mutate: approveJobRequest, isPending: isApprovePending } =
    useMutation({
      mutationFn: (id: number) => api.jobRequest.approve(id),
      onSuccess,
      onError: onError ? onError : defaultOnError,
    });
  const { mutate: rejectJobRequest, isPending: isRejectPending } = useMutation({
    mutationFn: (id: number) => api.jobRequest.reject(id),
    onSuccess,
    onError: onError ? onError : defaultOnError,
  });
  const { mutate: cancelJobRequest, isPending: isCancelPending } = useMutation({
    mutationFn: (id: number) => api.jobRequest.cancel(id),
    onSuccess,
    onError: onError ? onError : defaultOnError,
  });
  return {
    approveJobRequest,
    isApprovePending,
    rejectJobRequest,
    isRejectPending,
    cancelJobRequest,
    isCancelPending,
  };
};
