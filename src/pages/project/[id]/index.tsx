import BackButton from "@/components/BackButton/BackButton";
import { FieldLabel } from "@/components/FieldLabel/FieldLabel";
import { DeleteConfirmModalConfig } from "@/config/ConfirmModalConfig/ConfirmModalConfig";
import useCancelProject from "@/hooks/mutates/project/useCancelProject";
import useChangeStatusProject from "@/hooks/mutates/project/useChangeStatusProject";
import useGetBoqFromProject from "@/hooks/queries/boq/useGetBoqFromProject";
import useGetOverviewProject from "@/hooks/queries/project/useGetOverviewProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import { getBoqStatusMap } from "@/utils/boqStatusMap";
import { getProjectStatusMap } from "@/utils/projectStatusMap";
import { getQuotationStatusMap } from "@/utils/quotationStatusMap";
import {
  Badge,
  Button,
  Card,
  Divider,
  NumberFormatter,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import clsx from "clsx";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, User, FileText, Package, Calculator, Receipt, Files, ChartBar } from 'lucide-react';


export default function Project(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const getProjectApi = useGetProject({
    id: props.id ?? "",
  });
  const getBoqFromProject = useGetBoqFromProject({
    project_id: props.id ?? "",
  });
  const getQuoTationByProject = useGetQuotationByProject({
    project_id: props.id ?? "",
  });

  const getOverviewProject = useGetOverviewProject({ id: props.id ?? "" });

  const changeStatusProject = useChangeStatusProject();
  const cancelProject = useCancelProject();
  const changeStatus = () => {
    const boqStatus = getBoqFromProject.data?.data.status;
    const quotationStatus = getQuoTationByProject.data?.data.status;
    const projectStatus = getProjectApi.data?.data.status;

    // Define status transitions
    const statusTransitions = {
      planning: {
        nextStatus: "in_progress",
        label: "กำลังดำเนินการ",
        condition: () =>
          boqStatus === "approved" &&
          quotationStatus === "approved" &&
          projectStatus === "planning",
      },
      in_progress: {
        nextStatus: "completed",
        label: "เสร็จสิ้น",
        condition: () =>
          boqStatus === "approved" &&
          quotationStatus === "approved" &&
          projectStatus === "in_progress",
      },
    };

    // Find the applicable transition
    const currentTransition = Object.values(statusTransitions).find(
      (transition) => transition.condition()
    );

    if (!currentTransition) return;

    // Common modal configuration
    const modalConfig = {
      title: "ยืนยันการเปลี่ยนสถานะโครงการ",
      labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
      children: (
        <div className="flex items-center gap-1">
          ยืนยันการเปลี่ยนสถานะโครงการเป็น
          <Badge>{currentTransition.label}</Badge>
        </div>
      ),
      onConfirm: () => {
        changeStatusProject.mutate(
          {
            project_id: props.id!,
            status: currentTransition.nextStatus,
          },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "เปลี่ยนสถานะโครงการเรียบร้อย",
              });
              // Refetch all related data
              getQuoTationByProject.refetch();
              getBoqFromProject.refetch();
              getProjectApi.refetch();
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
          }
        );
      },
    };

    modals.openConfirmModal(modalConfig);
  };

  const isChangeStatusValid = () => {
    const boqStatus = getBoqFromProject.data?.data.status;
    const quotationStatus = getQuoTationByProject.data?.data.status;
    const projectStatus = getProjectApi.data?.data.status;

    if (
      boqStatus === "approved" &&
      quotationStatus === "approved" &&
      projectStatus === "planning"
    ) {
      return true;
    }

    if (
      boqStatus === "approved" &&
      quotationStatus === "approved" &&
      projectStatus === "in_progress"
    ) {
      return true;
    }

    return false;
  };

  const isSummaryValid = () => {
    const boqStatus = getBoqFromProject.data?.data.status;
    const quotationStatus = getQuoTationByProject.data?.data.status;
    const projectStatus = getProjectApi.data?.data.status;

    if (
      boqStatus === "approved" &&
      quotationStatus === "approved" &&
      projectStatus === "completed"
    ) {
      return true;
    }
    return false;
  };

  const onCancelProject = () => {
    modals.openConfirmModal({
      ...DeleteConfirmModalConfig,
      labels: { confirm: "ยกเลิกโครงการ", cancel: "ยกเลิก" },
      children: (
        <Text size="sm">
          คุณแน่ใจหรือไม่ว่าต้องการยกเลิกโครงการ{" "}
          <Badge>{getProjectApi.data?.data.name}</Badge>
        </Text>
      ),
      onConfirm: () => {
        cancelProject.mutate(
          {
            project_id: props.id!,
          },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "ยกเลิกโครงการเรียบร้อย",
              });
              getProjectApi.refetch();
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

  interface StatusBadgeProps {
    status: string;
    type?: "default" | "project";
  }

  const StatusBadge = ({ status, type = "default" }: StatusBadgeProps) => {
    const getStatusColor = () => {
      if (type === "project") {
        switch (status) {
          case "completed": return "bg-green-50 text-green-700 ring-green-600/20";
          case "in_progress": return "bg-blue-50 text-blue-700 ring-blue-600/20";
          case "cancelled": return "bg-red-50 text-red-700 ring-red-600/20";
          default: return "bg-gray-50 text-gray-700 ring-gray-600/20";
        }
      }
      return "bg-gray-50 text-gray-700 ring-gray-600/20";
    };

    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset ${getStatusColor()}`}>
        {status}
      </span>
    );
  };

  interface NavButtonProps {
    href: string;
    icon: React.ElementType;
    label: string;
    disabled?: boolean;
  }

  const NavButton = ({ href, icon: Icon, label, disabled = false }: NavButtonProps) => {
    const buttonClass = `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all
      ${disabled
        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
        : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`;

    if (disabled) {
      return (
        <button disabled className={buttonClass}>
          <Icon size={18} />
          {label}
        </button>
      );
    }

    return (
      <Link href={href}>
        <button className={buttonClass}>
          <Icon size={18} />
          {label}
        </button>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className=" px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <BackButton label="ย้อนกลับไปหน้ารายการโครงการ" href="/project" />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {getProjectApi.data?.data.name}
              </h1>
              <StatusBadge
                status={getProjectStatusMap(getProjectApi.data?.data.status ?? "")?.label ?? ""}
                type="project"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                disabled={!isChangeStatusValid()}
                size="sm"
                className="bg-white text-gray-700 hover:bg-gray-50"
                leftSection={<ArrowRight size={16} />}
                onClick={changeStatus}
              >
                เปลี่ยนสถานะ
              </Button>
              <Button
                disabled={getProjectApi.data?.data.status === "cancelled"}
                size="sm"
                color="red"
                variant="subtle"
                onClick={onCancelProject}
              >
                ยกเลิกโครงการ
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-6 flex flex-wrap gap-2 rounded-xl bg-gray-100/50 p-2">
          <NavButton href={`/project/${props.id}/boq`} icon={Calculator} label="BOQ" />
          <NavButton
            href={`/project/${props.id}/quotation`}
            icon={Receipt}
            label="ใบเสนอราคา"
            disabled={getBoqFromProject.data?.data.status !== "approved"}
          />
          <NavButton href={`/project/${props.id}/material`} icon={Package} label="วัสดุ" />
          <NavButton href={`/project/${props.id}/general-cost`} icon={FileText} label="ค่าใช้จ่ายทั่วไป" />
          <NavButton href={`/project/${props.id}/document`} icon={Files} label="เอกสาร" />
          <NavButton
            href={`/project/${props.id}/summary`}
            icon={ChartBar}
            label="สรุป"
            disabled={!isSummaryValid()}
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Project Details */}
          <Card withBorder className="overflow-hidden bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">รายละเอียดโครงการ</h2>
                {getProjectApi.data?.data.status !== "cancelled" && (
                  <Link href={"/project/edit/" + props.id}>
                    <Button variant="light">แก้ไข</Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="space-y-6 p-6">
              <div className="flex items-start gap-3">
                <Building2 className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500">ชื่อโครงการ</div>
                  <div className="mt-1 text-sm text-gray-900">{getProjectApi.data?.data.name}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500">สถานที่</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {getProjectApi.data?.data.address.address},{" "}
                    {getProjectApi.data?.data.address.subdistrict},{" "}
                    {getProjectApi.data?.data.address.district},{" "}
                    {getProjectApi.data?.data.address.province},{" "}
                    {getProjectApi.data?.data.address.postal_code}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500">ลูกค้า</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {getProjectApi.data?.data.client.name}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Overview & Stats */}
          <Card withBorder className="overflow-hidden bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-base font-semibold text-gray-900">ภาพรวมโครงการ</h2>
            </div>

            <div className="p-6">
              {/* Status Section */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">สถานะ BOQ</div>
                  <div className="mt-1">
                    <StatusBadge status={getBoqStatusMap(getBoqFromProject.data?.data.status!)?.label ?? "unknown"} />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">สถานะใบเสนอราคา</div>
                  <div className="mt-1">
                    <StatusBadge status={getQuotationStatusMap(getQuoTationByProject.data?.data.status ?? "")?.label ?? "unknown"} />
                  </div>
                </div>
              </div>

              <Divider className="my-6" />

              {/* Financial Overview */}
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-gray-500">ต้นทุนประเมินรวม</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                      <NumberFormatter
                        value={getOverviewProject.data?.data.total_overall_cost?.toFixed(2)}
                        thousandSeparator
                        prefix="฿"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">ต้นทุนจริงรวม</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                      <NumberFormatter
                        value={getOverviewProject.data?.data.total_actual_cost?.toFixed(2)}
                        thousandSeparator
                        prefix="฿"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-gray-500">ราคาขาย</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">
                      <NumberFormatter
                        value={getOverviewProject.data?.data.total_selling_price?.toFixed(2)}
                        thousandSeparator
                        prefix="฿"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">ราคาขายรวมภาษี</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">
                      <NumberFormatter
                        value={getOverviewProject.data?.data.total_with_tax?.toFixed(2)}
                        thousandSeparator
                        prefix="฿"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-gray-500">กำไรประเมิน</div>
                    <div className="mt-1 text-lg font-medium text-green-600">
                      <NumberFormatter
                        value={getOverviewProject.data?.data.estimated_profit?.toFixed(2)}
                        thousandSeparator
                        prefix="฿"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">กำไรจริง</div>
                    <div className="mt-1 text-lg font-medium text-green-600">
                      <NumberFormatter
                        value={getOverviewProject.data?.data.actual_profit?.toFixed(2)}
                        thousandSeparator
                        prefix="฿"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
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
