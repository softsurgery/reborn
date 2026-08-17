import { useMutation, useQueryClient } from "@tanstack/react-query";
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
}: useJobSaveActionsProps = {}) => {
  const queryClient = useQueryClient();

  const defaultOnError = (error: ServerErrorResponse) => {
    toast.error("Oops! Failed to perform action", {
      description: error.response?.data?.message || "Please try again later.",
    });
  };

  const { mutate: saveJob, isPending: isSavePending } = useMutation({
    mutationFn: (id: string) => api.jobSave.create({ jobId: id }),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["is-job-saved", id] });
      const previousIsSaved = queryClient.getQueryData(["is-job-saved", id]);
      queryClient.setQueryData(["is-job-saved", id], true);
      return { previousIsSaved };
    },
    onSuccess,
    onError: (err: Error, id: string, context: any) => {
      queryClient.setQueryData(["is-job-saved", id], context?.previousIsSaved);
      if (onError) onError(err);
      else defaultOnError(err as ServerErrorResponse);
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: ["is-job-saved", id] });
    },
  });

  const { mutate: unsaveJob, isPending: isUnsavePending } = useMutation({
    mutationFn: (id: string) => api.jobSave.remove(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["is-job-saved", id] });
      const previousIsSaved = queryClient.getQueryData(["is-job-saved", id]);
      queryClient.setQueryData(["is-job-saved", id], false);
      return { previousIsSaved };
    },
    onSuccess,
    onError: (err: Error, id: string, context: any) => {
      queryClient.setQueryData(["is-job-saved", id], context?.previousIsSaved);
      if (onError) onError(err);
      else defaultOnError(err as ServerErrorResponse);
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: ["is-job-saved", id] });
    },
  });

  return {
    saveJob,
    isSavePending,
    unsaveJob,
    isUnsavePending,
  };
};
