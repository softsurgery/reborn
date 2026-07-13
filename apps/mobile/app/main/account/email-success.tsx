import { EmailChangedSuccess } from "@/components/profile/EmailChangedSuccess";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function Screen() {
  const queryClient = useQueryClient();
  React.useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["current-user"] });
  }, []);
  return <EmailChangedSuccess />;
}
