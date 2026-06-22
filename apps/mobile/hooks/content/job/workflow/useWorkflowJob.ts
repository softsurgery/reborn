import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface useWorkflowJobProps {
  id?: string;
  join?: string;
  enabled: boolean;
}

export const useWorkflowJob = (
  { id, join, enabled = true }: useWorkflowJobProps = {
    enabled: true,
  },
) => {
  const {
    data: jobWorkflowResp,
    isPending: isjobWorkflowPending,
    refetch: refetchJobWorkflow,
  } = useQuery({
    queryKey: ["job-workflow", id],
    queryFn: async () => {
      return api.job.workflow.findById(id!, join);
    },
    enabled: enabled && !!id,
  });

  const jobWorkflow = React.useMemo(() => {
    if (!jobWorkflowResp) return null;
    return jobWorkflowResp.job;
  }, [jobWorkflowResp]);

  return {
    jobWorkflow,
    isjobWorkflowPending,
    refetchJobWorkflow,
  };
};
