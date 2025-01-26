import BackButton from "@/components/BackButton/BackButton";
import JobBoq from "@/components/Boq/JobBoq/JobBoq";
import GeneralCost from "@/components/Boq/GeneralCost/GeneralCost";
import useGetBoqFromProject from "@/hooks/queries/boq/useGetBoqFromProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import { getBoqStatusMap } from "@/utils/boqStatusMap";
import {
  Badge,
  Button,
  Tabs,
  Text,
} from "@mantine/core";
import {
  IconFileText,
} from "@tabler/icons-react";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import useApproveBoq from "@/hooks/mutates/boq/useApproveBoq";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { useSession } from "next-auth/react";
import {
  ClipboardList,
  FileText,
  Calculator,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function BOQ(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { data: session } = useSession();
  const getProject = useGetProject({ id: props.id ?? "" });
  const getBoqFromProject = useGetBoqFromProject({
    project_id: props.id ?? "",
  });
  const approveBoq = useApproveBoq();
  const onChangeStatus = () => {
    modals.openConfirmModal({
      title: "เปลี่ยนสถานะ",
      children: (
        <div className="flex items-center gap-1">
          คุณต้องการเปลี่ยนสถานะเป็น <Badge>อนุมัติ</Badge> ใช่หรือไม่ ?
        </div>
      ),
      labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
      onConfirm: () => {
        approveBoq.mutate(
          {
            boq_id: getBoqFromProject.data?.data.id!,
          },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "อนุมัติ boq สําเร็จ",
                color: "green",
              });
              getBoqFromProject.refetch();
            },
          },
        );
      },
    });
  };

  const isApproved = getBoqFromProject.data?.data.status === "approved";

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusStyle = () => {
      switch (status) {
        case 'approved':
          return 'bg-green-50 text-green-700 ring-green-600/20';
        case 'pending':
          return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
        default:
          return 'bg-gray-50 text-gray-700 ring-gray-600/20';
      }
    };

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset ${getStatusStyle()}`}>
        {status === 'approved' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
        {getBoqStatusMap(status as string)?.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className=" px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <BackButton href={`/project/${props.id}`} />

          <div className="mt-6 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">BOQ</h1>
                <StatusBadge status={getBoqFromProject.data?.data.status ?? 'unknown'} />
              </div>
              <Text className="text-base text-gray-600">
                {getProject.data?.data.name}
              </Text>
            </div>

            <div className="flex items-center gap-3">
              {isApproved ? (
                <a
                  target="_blank"
                  href={`/api/report/boq/${props.id}?user_id=${session?.user.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all hover:bg-gray-50"
                >
                  <FileText size={16} />
                  Export
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-400"
                >
                  <FileText size={16} />
                  Export
                </button>
              )}

              <Button
                disabled={isApproved}
                onClick={onChangeStatus}
                size="md"
                className={`${isApproved
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                เปลี่ยนสถานะ
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-200">
          <Tabs
            defaultValue="job"
            classNames={{
              list: "border-b border-gray-200",
              tab: "transition-all duration-200 hover:bg-gray-50 data-[active]:bg-gray-100 rounded-lg mx-1 px-4 h-11",
              panel: "p-6"
            }}
          >
            <Tabs.List>
              <Tabs.Tab
                value="job"
                leftSection={<ClipboardList size={18} />}
                className="text-sm font-medium"
              >
                งานทั้งหมด
              </Tabs.Tab>
              <Tabs.Tab
                value="general_cost"
                leftSection={<Calculator size={18} />}
                className="text-sm font-medium"
              >
                ค่าใช้จ่ายทั่วไปของ BOQ
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="job">
              <div className="min-h-[300px]">
                <JobBoq project_id={props.id ?? ""} />
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="general_cost">
              <div className="min-h-[300px]">
                <GeneralCost project_id={props.id ?? ""} />
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      id: context.query.id?.toString(),
    },
  };
}
