import { ImageSource } from "expo-image";
import { ImageFile } from "~/components/shared/form-builder/types";
import { ResponseGenericUploadDto } from "~/types";

export const extractImageFiles = (
  uploads: (ResponseGenericUploadDto & Record<string, any>)[],
  sources: (ImageSource | undefined)[],
): ImageFile[] =>
  uploads
    .sort((a, b) => a.order - b.order)
    .flatMap((upload, index) => {
      const source = sources[index];
      if (
        !source ||
        typeof source !== "object" ||
        !("uri" in source) ||
        !source.uri
      ) {
        return [];
      }
      return [
        {
          id: upload.id,
          serverId: upload.uploadId,
          uri: source.uri,
          headers: "headers" in source ? source.headers : undefined,
          name: upload.upload?.slug ?? "",
          type: upload.upload?.mimetype ?? "image/jpeg",
          progress: 100,
          order: upload.order,
        },
      ];
    });
