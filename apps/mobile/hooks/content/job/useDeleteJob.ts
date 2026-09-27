import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteJob,
    isPending: isDeletingJob,
  } = useMutation({
    mutationFn: (id: string) => api.job.remove(id),
    onSuccess: () => {
      toast.success("Job deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["current-jobs"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete job");
    },
  });

  return {
    deleteJob,
    isDeletingJob,
  };
};
