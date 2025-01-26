import { Badge, Button, Menu, rem, Text, UnstyledButton } from "@mantine/core";
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
import useGetJobs from "@/hooks/queries/job/useGetJobs";
import useDeleteJob from "@/hooks/mutates/job/useDeleteJob";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";

export default function Job() {
  const getJobsApi = useGetJobs();
  const deleteJob = useDeleteJob();

  type ColumnType = NonNullable<typeof getJobsApi.data>["data"]["jobs"] extends
    | (infer T)[]
    | null
    | undefined
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
        deleteJob.mutate({ job_id: record.job_id }, {
          onSuccess: () => {
            notifications.show({
              title: "สําเร็จ",
              message: "ลบงานสําเร็จ",
              color: "green",
            })
            getJobsApi.refetch();
          },
          onError: (error) => {
            if (error instanceof AxiosError) {
              notifications.show({
                title: "เกิดข้อผิดพลาด",
                message: error.response?.data.error,
                color: "red",
              });
            }
          }
        });
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Text size="xl" fw={700}>
            รายการงาน
          </Text>
          <Link href="/job/create">
            <Button leftSection={<IconPlus size={15} />}>เพิ่มงาน</Button>
          </Link>
        </div>
        <DataTable
          records={getJobsApi.data?.data.jobs ?? []}
          columns={[
            {
              accessor: "name",
              title: "ชื่องาน",
            },
            {
              accessor: "description",
              title: "รายละเอียดงาน",
            },
            {
              accessor: "unit",
              title: "หน่วยของงาน",
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
                    <Link href={"/job/edit/" + record.job_id}>
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
