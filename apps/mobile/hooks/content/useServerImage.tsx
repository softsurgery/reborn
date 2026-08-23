import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Image, View } from "react-native";
import { api } from "~/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/stables/StableAvatar";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface UseServerImageProps {
  id?: number;
  size?: { width?: number; height?: number };
  fallback?: string | React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  fallbackClassName?: string;
  rounded?: boolean;
  enabled?: boolean;
}

export const useServerImage = ({
  id,
  size,
  fallback,
  className,
  wrapperClassName,
  fallbackClassName,
  enabled = true,
}: UseServerImageProps) => {
  const { data: uploadResp, isLoading: isUploadPending } = useQuery({
    queryKey: ["server-image", id],
    queryFn: async () => api.upload.getUploadById(id!),
    enabled: !!id && enabled,
  });

  const upload = React.useMemo(() => uploadResp ?? null, [uploadResp]);

  const jsx = React.useMemo(() => {
    if (upload && !isUploadPending) {
      return (
        <View
          className={cn(wrapperClassName, "flex items-center justify-center")}
          style={{
            width: size?.width ? size.width * 1.05 : "100%",
            height: size?.height ? size.height * 1.05 : "100%",
          }}
        >
          <Image
            className={cn(className)}
            source={{
              uri: upload,
            }}
            style={{
              width: size?.width || "auto",
              height: size?.height || "auto",
            }}
          />
        </View>
      );
    }

    if (isUploadPending && id) {
      return (
        <Skeleton
          className={cn(className)}
          style={{
            ...size,
          }}
        />
      );
    }

    if (
      fallback &&
      typeof fallback === "object" &&
      ("uri" in fallback || typeof fallback === "number")
    ) {
      return (
        <View
          className={cn(wrapperClassName, "flex items-center justify-center")}
          style={{
            width: size?.width ? size.width * 1.05 : "100%",
            height: size?.height ? size.height * 1.05 : "100%",
          }}
        >
          <Image
            className={cn(className)}
            alt={typeof fallback === "string" ? fallback : ""}
            style={{
              width: size?.width || "auto",
              height: size?.height || "auto",
            }}
          />
        </View>
      );
    }

    // 4️⃣ Fallback is a string → render Avatar with initials
    if (typeof fallback === "string") {
      return (
        <Avatar
          className={cn(className)}
          style={{
            width: size?.width || "100%",
            height: size?.height || "100%",
          }}
        >
          <AvatarImage />
          <AvatarFallback>
            <Text className={fallbackClassName}>{fallback.toUpperCase()}</Text>
          </AvatarFallback>
        </Avatar>
      );
    }

    // 5️⃣ Fallback is a React element → render it directly
    if (React.isValidElement(fallback)) {
      return fallback;
    }

    // 6️⃣ Default → Skeleton
    return (
      <Skeleton
        className={cn(className)}
        style={{
          ...size,
        }}
      />
    );
  }, [upload, isUploadPending, fallback, size]);

  return { upload, isUploadPending, jsx };
};
