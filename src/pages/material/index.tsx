import {
  Badge,
  Button,
  Menu,
  rem,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import React from "react";
import Link from "next/link";
import { modals } from "@mantine/modals";
import { DeleteConfirmModalConfig } from "@/config/ConfirmModalConfig/ConfirmModalConfig";
import useGetMaterials from "@/hooks/queries/material/useGetMaterials";
import useDeleteMaterial from "@/hooks/mutates/material/useDeleteMaterial";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";

export default function Material() {
  const [opened, { open, close }] = useDisclosure(false);
  const getMaterials = useGetMaterials();
  const deleteMaterial = useDeleteMaterial();

  type ColumnType = NonNullable<
    typeof getMaterials.data
  >["data"]["materials"] extends (infer T)[] | null | undefined
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
        deleteMaterial.mutate(
          { material_id: record.material_id! },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "ลบวัสดุสําเร็จ",
                color: "green",
              });
              getMaterials.refetch();
            },
            onError: (error) => {
              if (error instanceof AxiosError) {
                notifications.show({
                  title: "เกิดข้อผิดพลาด",
                  message: error.response?.data.error,
                  color: "red",
                });
              }
            },
          },
        );
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Text size="xl" fw={700}>
            รายการวัสดุ
          </Text>
          <Link href="/material/create">
            <Button leftSection={<IconPlus size={15} />}>เพิ่มวัสดุ</Button>
          </Link>
        </div>
        <DataTable
          records={getMaterials.data?.data.materials ?? []}
          columns={[
            {
              accessor: "name",
              title: "ชื่อ",
            },
            {
              accessor: "unit",
              title: "หน่วยของวัสดุ",
              render: (record) => <Badge>{record.unit}</Badge>,
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
                    <Link href={"/material/edit/" + record.material_id}>
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
