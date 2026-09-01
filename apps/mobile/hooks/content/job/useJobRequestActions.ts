import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { api } from "@/api";
import { ServerErrorResponse } from "@/types";

interface useJobRequestActionsProps {
  onSuccess?: (...args: any[]) => void;
  onError?: (...args: any[]) => void;
}

export const useJobRequestActions = ({
  onSuccess,
  onError,
}: useJobRequestActionsProps = {}) => {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string, ...args: any[]) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ["requests"] });
    queryClient.invalidateQueries({ queryKey: ["job-request"] });
    queryClient.invalidateQueries({ queryKey: ["job-metadata"] });
    onSuccess?.(...args);
  };

  const defaultOnError = (error: ServerErrorResponse, defaultMsg: string) => {
    toast.error(
      error?.response?.data?.message || defaultMsg || "Please try again later.",
    );
  };

  const { mutate: approveJobRequest, isPending: isApprovePending } =
    useMutation({
      mutationFn: (id: number) => api.jobRequest.approve(id),
      onSuccess: (...args) => handleSuccess("Job request approved", ...args),
      onError: (error: ServerErrorResponse) => {
        if (onError) onError(error);
        else defaultOnError(error, "Failed to approve job request");
      },
    });

  const { mutate: rejectJobRequest, isPending: isRejectPending } = useMutation({
    mutationFn: (id: number) => api.jobRequest.reject(id),
    onSuccess: (...args) => handleSuccess("Job request rejected", ...args),
    onError: (error: ServerErrorResponse) => {
      if (onError) onError(error);
      else defaultOnError(error, "Failed to reject job request");
    },
  });

  const { mutate: waitlistJobRequest, isPending: isWaitlistPending } = useMutation({
    mutationFn: (id: number) => api.jobRequest.waitlist(id),
    onSuccess: (...args) => handleSuccess("Job request moved to waitlist", ...args),
    onError: (error: ServerErrorResponse) => {
      if (onError) onError(error);
      else defaultOnError(error, "Failed to waitlist job request");
    },
  });

  const { mutate: cancelJobRequest, isPending: isCancelPending } = useMutation({
    mutationFn: (id: number) => api.jobRequest.cancel(id),
    onSuccess: (...args) => handleSuccess("Job request cancelled", ...args),
    onError: (error: ServerErrorResponse) => {
      if (onError) onError(error);
      else defaultOnError(error, "Failed to cancel job request");
    },
  });

  const { mutate: updateJobRequest, isPending: isUpdatePending } = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: any }) => api.jobRequest.update(id, dto),
    onSuccess: (...args) => handleSuccess("Job request updated", ...args),
    onError: (error: ServerErrorResponse) => {
      if (onError) onError(error);
      else defaultOnError(error, "Failed to update job request");
    },
  });

  return {
    approveJobRequest,
    isApprovePending,
    rejectJobRequest,
    isRejectPending,
    waitlistJobRequest,
    isWaitlistPending,
    cancelJobRequest,
    isCancelPending,
    updateJobRequest,
    isUpdatePending,
  };
};
