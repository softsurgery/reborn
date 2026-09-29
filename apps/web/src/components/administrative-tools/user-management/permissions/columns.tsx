import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@reborn/datatable-builder";
import { ResponsePermissionDto } from "@/types";
import { DataTableConfig } from "@reborn/datatable-builder";

export const getPermissionColumns = (
  context: DataTableConfig<ResponsePermissionDto>
): ColumnDef<ResponsePermissionDto>[] => {
  return [
    {
      accessorKey: "label",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Label"}
          attribute="label"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.label}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Description"}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row?.original?.description}</div>,
      enableSorting: true,
      enableHiding: true,
    },
  ];
};
