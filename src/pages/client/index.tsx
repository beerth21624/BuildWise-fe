import {
  Badge,
  Button,
  Drawer,
  Menu,
  MultiSelect,
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
import useGetClients from "@/hooks/queries/client/useGetClients";
import useDeleteClient from "@/hooks/mutates/client/useDeleteClient";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";

export default function ClientList() {
  const [opened, { open, close }] = useDisclosure(false);
  const getClientsApi = useGetClients();
  const deleteClientApi = useDeleteClient();

  type ColumnType = NonNullable<
    typeof getClientsApi.data
  >["data"]["clients"] extends (infer T)[] | null | undefined
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
        deleteClientApi.mutate(
          { client_id: record.id! },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "ลบข้อมูลสําเร็จ",
                color: "green",
                loading: false,
              })
              getClientsApi.refetch();
            },
            onError: (error) => {
              if (error instanceof AxiosError) {
                console.log(error);
                notifications.show({
                  title: "เกิดข้อผิดพลาด",
                  message: error.response?.data.error,
                  color: "red",
                  loading: false,
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
            รายการลูกค้า
          </Text>
          <Link href="/client/create">
            <Button leftSection={<IconPlus size={15} />}>สร้างลูกค้า</Button>
          </Link>
        </div>
        <DataTable
          records={getClientsApi.data?.data.clients ?? []}
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
              accessor: "tax_id",
              title: "เลขประจำตัวผู้เสียภาษี",
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
                    <Link href={"/client/edit/" + record.id}>
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
