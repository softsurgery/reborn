import React from "react";
import { useServerImages } from "@/hooks/content/useServerImages";
import { DataTableCell } from "@reborn/datatable-builder";
import { DataTableCellVariant } from "@reborn/datatable-builder";

const UserAvatarCell = React.memo(
  ({ pictureId, fallback }: { pictureId?: number; fallback?: string }) => {
    const { uploads: [url] } = useServerImages({
      ids: [pictureId],
      enabled: !!pictureId,
    });

    return (
      <DataTableCell
        variant={DataTableCellVariant.AVATAR}
        value={{ url, fallback }}
        className="my-2 w-14 h-14 bg-muted border-2 rounded-full"
      />
    );
  }
);

UserAvatarCell.displayName = "UserAvatarCell";

export default UserAvatarCell;
