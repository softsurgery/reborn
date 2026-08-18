import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner-native";
import { api } from "~/api";
import { Paginated, ResponseJobSaveDto, ServerErrorResponse } from "~/types";

interface useJobSaveActionsProps {
  onSuccess?: (data: ResponseJobSaveDto, id: string, context: unknown) => void;
  onError?: (error: Error, id: string, context: unknown) => void;
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
      const previousIsSaved = queryClient.getQueryData<boolean>([
        "is-job-saved",
        id,
      ]);
      queryClient.setQueryData(["is-job-saved", id], true);
      return { previousIsSaved };
    },
    onSuccess,
    onError: (
      err: Error,
      id: string,
      context: { previousIsSaved?: boolean } | undefined,
    ) => {
      queryClient.setQueryData(["is-job-saved", id], context?.previousIsSaved);
      if (onError) onError(err, id, context);
      else defaultOnError(err as ServerErrorResponse);
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: ["is-job-saved", id] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
  });

  const { mutate: unsaveJob, isPending: isUnsavePending } = useMutation({
    mutationFn: (id: string) => api.jobSave.remove(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["is-job-saved", id] });
      const previousIsSaved = queryClient.getQueryData<boolean>([
        "is-job-saved",
        id,
      ]);
      queryClient.setQueryData(["is-job-saved", id], false);

      queryClient.setQueriesData<InfiniteData<Paginated<ResponseJobSaveDto>>>(
        { queryKey: ["saved-jobs"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter(
                (savedJob) => savedJob.jobId !== id && savedJob.job?.id !== id,
              ),
            })),
          };
        },
      );

      return { previousIsSaved };
    },
    onSuccess,
    onError: (
      err: Error,
      id: string,
      context: { previousIsSaved?: boolean } | undefined,
    ) => {
      queryClient.setQueryData(["is-job-saved", id], context?.previousIsSaved);
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      if (onError) onError(err, id, context);
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
