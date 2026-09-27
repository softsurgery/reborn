import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import { ImageSource } from "expo-image";
import React from "react";
import { View } from "react-native";
import { api } from "~/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/stables/StableAvatar";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";

interface UseServerImagesProps {
  ids: (number | undefined)[];
  fallbacks?: (string | React.ReactNode | ImageSource | undefined)[];
  size?: { width?: number; height?: number };
  className?: string;
  wrapperClassName?: string;
  fallbackClassName?: string;
  enabled?: boolean;
}

export const useServerImages = ({
  ids,
  fallbacks = [],
  size,
  className,
  wrapperClassName,
  fallbackClassName,
  enabled = true,
}: UseServerImagesProps) => {
  const uniqueIds = React.useMemo(
    () => Array.from(new Set(ids.filter((id): id is number => Boolean(id)))),
    [ids],
  );

  const queries = useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: ["server-image", id],
      queryFn: () => api.upload.getUploadById(id),
      enabled,
      staleTime: Infinity,
    })),
  });

  const queryMap = React.useMemo(() => {
    const map = new Map<number, (typeof queries)[number]>();

    uniqueIds.forEach((id, index) => {
      map.set(id, queries[index]);
    });

    return map;
  }, [uniqueIds, queries]);

  const uploads = React.useMemo(
    () =>
      ids.map((id) =>
        id ? (queryMap.get(id)?.data as ImageSource | undefined) : undefined,
      ),
    [ids, queryMap],
  );

  const isPending = queries.some((query) => query.isPending);

  const jsxArray = React.useMemo(() => {
    return ids.map((id, index) => {
      const query = id ? queryMap.get(id) : undefined;
      const upload = query?.data as ImageSource | undefined;
      const fallback = fallbacks[index];

      // Image loaded
      if (upload) {
        return (
          <View
            key={index}
            className={cn(wrapperClassName, "flex items-center justify-center")}
            style={{
              width: size?.width ? size.width * 1.05 : "100%",
              height: size?.height ? size.height * 1.05 : "100%",
            }}
          >
            <Image
              className={cn(className)}
              source={upload}
              style={{
                width: size?.width,
                height: size?.height,
              }}
              contentFit="cover"
            />
          </View>
        );
      }

      // Query is loading
      if (id && query?.isFetching) {
        return (
          <Skeleton
            key={index}
            className={cn(className)}
            style={{
              width: size?.width,
              height: size?.height,
            }}
          />
        );
      }

      // ImageSource fallback
      if (
        fallback &&
        typeof fallback === "object" &&
        ("uri" in fallback || "source" in fallback)
      ) {
        return (
          <View
            key={index}
            className={cn(wrapperClassName, "flex items-center justify-center")}
            style={{
              width: size?.width ? size.width * 1.05 : "100%",
              height: size?.height ? size.height * 1.05 : "100%",
            }}
          >
            <Image
              source={fallback as ImageSource}
              className={cn(className)}
              style={{
                width: size?.width,
                height: size?.height,
              }}
              contentFit="cover"
            />
          </View>
        );
      }

      // Text fallback
      if (typeof fallback === "string") {
        return (
          <Avatar
            key={index}
            className={cn(className)}
            style={{
              width: size?.width,
              height: size?.height,
            }}
          >
            <AvatarImage />
            <AvatarFallback>
              <Text className={fallbackClassName}>
                {fallback.toUpperCase()}
              </Text>
            </AvatarFallback>
          </Avatar>
        );
      }

      // React element fallback
      if (React.isValidElement(fallback)) {
        return React.cloneElement(fallback, { key: index });
      }

      // Nothing available
      return (
        <Skeleton
          key={index}
          className={cn(className)}
          style={{
            width: size?.width,
            height: size?.height,
          }}
        />
      );
    });
  }, [
    ids,
    fallbacks,
    queryMap,
    size,
    className,
    wrapperClassName,
    fallbackClassName,
  ]);

  return {
    uploads,
    isPending,
    jsxArray,
    refetch: () => queries.forEach((q) => q.refetch()),
  };
};
