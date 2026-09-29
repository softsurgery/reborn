import React from "react";
import { cn } from "@reborn/lib";
import { Button } from "@reborn/ui";
import { Save } from "lucide-react";
import { FormBuilder } from "@reborn/form-builder";
import { useReferenceTypesStore } from "@/hooks/stores/useReferenceTypesStore";
import { useUpdateRefParamFormStructure } from "./useUpdateRefParamFormStructure";
import { useRefTypes } from "@/hooks/content/reference-types/useRefTypes";
import { mapToSelectOptions } from "@reborn/form-builder";

interface RefParamUpdateFormProps {
  className?: string;
  refParamCallback?: () => void;
  cancelCallback?: () => void;
  isPending?: boolean;
}

export const RefParamUpdateForm = ({
  className,
  refParamCallback,
  cancelCallback,
  isPending,
}: RefParamUpdateFormProps) => {
  const referenceTypesStore = useReferenceTypesStore();
  const { refTypes, isRefTypesPending } = useRefTypes();
  const { refParamUpdateFormStructure } = useUpdateRefParamFormStructure({
    referenceTypesStore,
    refTypesOptions: mapToSelectOptions({
      data: isRefTypesPending ? [] : refTypes,
      labelKey: "label",
      valueKey: "id",
    }),
  });

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-2", className)}
    >
      <FormBuilder
        className="h-full flex flex-col flex-1 overflow-auto"
        structure={refParamUpdateFormStructure}
      />
      <div className="flex gap-2 justify-end px-4 py-3 border-t">
        <Button
          onClick={() => {
            refParamCallback?.();
          }}
          disabled={isPending}
        >
          <Save />
          Save
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => {
            cancelCallback?.();
          }}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
