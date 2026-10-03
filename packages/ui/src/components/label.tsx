import * as React from "react"
import { cn } from "#lib/utils"
import { Label as LabelPrimitive } from "radix-ui"
import { useRTL } from "../hooks/useRTL"

function Label({
  className,
  dir,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { dir: currentDir } = useRTL(dir as "ltr" | "rtl" | undefined)

  return (
    <LabelPrimitive.Root
      dir={currentDir}
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
