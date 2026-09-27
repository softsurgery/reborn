import { cn } from "@/lib/utils";
import { Platform, TextInput } from "react-native";
import { useRTL } from "~/hooks/useRTL";

function Textarea({
  className,
  multiline = true,
  numberOfLines = Platform.select({ web: 2, native: 8 }),
  placeholderClassName,
  ...props
}: React.ComponentProps<typeof TextInput>) {
  const isRTL = useRTL();

  return (
    <TextInput
      className={cn(
        "text-foreground border-input dark:bg-input/30 flex min-h-36 w-full flex-row rounded-xl border bg-transparent px-3 py-2 text-base leading-5 shadow-sm shadow-black/5 md:text-sm",
        Platform.select({
          web: "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content resize-y outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed",
          native: "placeholder:text-muted-foreground/50 text-base",
        }),
        "font-poppins",
        props.editable === false && "opacity-50",
        className,
      )}
      placeholderClassName={cn(
        "text-base font-poppins text-muted-foreground",
        placeholderClassName,
      )}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      {...props}
      textAlign={props.textAlign ?? (isRTL ? "right" : "left")}
      writingDirection={isRTL ? "rtl" : "ltr"}
    />
  );
}

export { Textarea };
