import {
  Badge,
  Button,
  Drawer,
  Menu,
  MultiSelect,
  rem,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { format } from "date-fns";
import {
  IconDotsVertical,
  IconEdit,
  IconFilter,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import React from "react";
import Link from "next/link";
import { modals } from "@mantine/modals";
import { DeleteConfirmModalConfig } from "@/config/ConfirmModalConfig/ConfirmModalConfig";
import useGetSuppliers from "@/hooks/queries/supplier/useGetSuppliers";
import useDeleteSupplier from "@/hooks/mutates/supplier/useDeleteSupplier";
import { AxiosError } from "axios";

export default function SupplierList() {
  const [opened, { open, close }] = useDisclosure(false);
  const GetSuppliersApi = useGetSuppliers();
  const deleteSupplierApi = useDeleteSupplier();

  type ColumnType = NonNullable<
    typeof GetSuppliersApi.data
  >["data"]["suppliers"] extends (infer T)[] | null | undefined
    ? T
    : never;

  const onDelete = (record: ColumnType) => {
    modals.openConfirmModal({
      ...DeleteConfirmModalConfig,
      children: (
        <Text size="sm">
          คุณแน่ใจหรือไม่ว่าต้องการลบ <Badge>{record.name}</Badge>
        </Text>
      ),
      onConfirm: () => {
        deleteSupplierApi.mutate(
          { supplier_id: record.id! },
          {
            onSuccess: () => {
              GetSuppliersApi.refetch();
            },
          },
        );
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
        }
      },
    });
  };

  return (
    <>
      <Drawer
        opened={opened}
        position="right"
        onClose={close}
        title="การค้นหาขั้นสูง"
      >
        <div className="flex flex-col gap-3">
          <MultiSelect
            searchable
            clearable
            label="สถานะ BOQ"
            placeholder="สถานะ BOQ"
            data={["แบบร่าง", "ยังไม่ได้ทำ", "ทำแล้ว"]}
          />
        </div>
      </Drawer>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Text size="xl" fw={700}>
            รายการซัพพลายเออร์
          </Text>
          <Link href="/supplier/create">
            <Button leftSection={<IconPlus size={15} />}>
              สร้างซัพพลายเออร์
            </Button>
          </Link>
        </div>
        <DataTable
          records={GetSuppliersApi.data?.data.suppliers ?? []}
          columns={[
            {
              accessor: "name",
              title: "ชื่อ",
            },
            {
              accessor: "email",
              title: "อีเมล",
            },
            {
              accessor: "tel",
              title: "เบอร์โทรติดต่อ",
            },
            {
              accessor: "id",
              title: "ดำเนินการ",
              textAlign: "center",
              render: (record) => (
                <Menu
                  shadow="md"
                  width={200}
                  position="bottom-end"
                  trigger="hover"
                  withArrow
                >
                  <Menu.Target>
                    <UnstyledButton variant="transparent">
                      <IconDotsVertical size={15} color="gray" />
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>การดำเนินการ</Menu.Label>
                    <Link href={"/supplier/edit/" + record.id}>
                      <Menu.Item
                        leftSection={
                          <IconPencil
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        }
                      >
                        แก้ไข
                      </Menu.Item>
                    </Link>
                    <Menu.Item
                      leftSection={
                        <IconTrash
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                      onClick={() => onDelete(record)}
                      color="red"
                    >
                      ลบ
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
