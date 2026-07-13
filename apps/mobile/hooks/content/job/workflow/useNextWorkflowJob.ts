import { api } from "@/api";
import { JobEvents, ResponseJobWorkflowDto } from "@/types";
import { useMutation } from "@tanstack/react-query";

interface useNextWorkflowJobProps {
  id: string;
  onSuccess: (job: ResponseJobWorkflowDto) => void;
  onError: (error: Error) => void;
}

export const useNextWorkflowJob = ({
  id,
  onSuccess,
  onError,
}: useNextWorkflowJobProps) => {
  const { mutateAsync: nextJobWorkflow, isPending: isNextJobWorkflowPending } =
    useMutation({
      mutationFn: (nextStep: JobEvents) => api.job.workflow.next(id, nextStep),
      onSuccess,
      onError,
    });
  return { nextJobWorkflow, isNextJobWorkflowPending };
};
