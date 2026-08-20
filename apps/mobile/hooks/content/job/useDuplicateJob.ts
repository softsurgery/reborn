import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";

export const useDuplicateJob = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: duplicateJob, isPending: isDuplicatingJob } =
    useMutation({
      mutationFn: (id: string) => api.job.duplicate(id),
      onSuccess: () => {
        toast.success("Job duplicated successfully");
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["current-jobs"] });
      },
      onError: () => {
        toast.error("Failed to duplicate job");
      },
    });

  return {
    duplicateJob,
    isDuplicatingJob,
  };
};
