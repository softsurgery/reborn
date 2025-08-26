import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import { Image } from "expo-image";
import { useMemo } from "react";
import { FlashList } from "@shopify/flash-list";

interface ImageData {
  id: string;
  url: string;
}

interface Page {
  images: ImageData[];
  nextPage: number;
}

// Mock API call using Lorem Picsum
const fetchImages = async ({ pageParam = 1 }): Promise<Page> => {
  const images = Array.from({ length: 10 }, (_, index) => ({
    id: `${pageParam}-${index}`,
    url: `https://picsum.photos/300/200?random=${pageParam * 10 + index}`,
  }));
  return { images, nextPage: pageParam + 1 };
};

export default function ImageGallery() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["images"],
    initialPageParam: 1,
    queryFn: fetchImages,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const images = useMemo(
    () => data?.pages.flatMap((page) => page.images) || [],
    [data]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlashList
        data={images}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            tintColor={"blue"}
            refreshing={isRefetching}
            onRefresh={refetch}
          />
        }
        estimatedItemSize={210}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.url }}
            style={{ width: "100%", height: 200, marginVertical: 5 }}
            cachePolicy="memory-disk"
          />
        )}
        onEndReachedThreshold={0.2}
        onEndReached={() =>
          hasNextPage && !isFetchingNextPage && fetchNextPage()
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              color="blue"
              size="small"
              style={{ marginBottom: 5 }}
            />
          ) : null
        }
      />
    </View>
  );
}
