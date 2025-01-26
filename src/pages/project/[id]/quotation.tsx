import BackButton from "@/components/BackButton/BackButton";
import QuotationForm from "@/components/Quotation/QuotationForm/QuotationForm";
import useApproveQuotationByProject from "@/hooks/mutates/quotation/useApproveQuotationByProject";
import useUpdateSellingPriceQuotationByProject from "@/hooks/mutates/quotation/useUpdateSellingPriceQuotationByProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import { type QuotationSchemaType } from "@/schemas/quotation/quotation.schema";
import { getQuotationStatusMap } from "@/utils/quotationStatusMap";
import { Badge, Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { useSession } from "next-auth/react";
import { FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function Quotation(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { data: session } = useSession();
  const getProjectApi = useGetProject({
    id: props.id ?? "",
  });
  const getQuotationByProject = useGetQuotationByProject({
    project_id: props.id ?? "",
  });
  const approveQuotationByProject = useApproveQuotationByProject();
  const updateSellingPriceQuotationByProject =
    useUpdateSellingPriceQuotationByProject();

  const onChangeStatus = () => {
    modals.openConfirmModal({
      title: "ยืนยันการเปลี่ยนสถานะ",
      centered: true,
      children: (
        <div className="flex items-center gap-1">
          คุณต้องการเปลี่ยนสถานะเป็น <Badge>อนุมัติ</Badge> ใช่หรือไม่ ?
        </div>
      ),
      labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
      onConfirm: () => {
        approveQuotationByProject.mutate(
          { project_id: getProjectApi.data?.data.id! },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "อนุมัติใบเสนอราคาสําเร็จ",
                color: "green",
              });
              getQuotationByProject.refetch();
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

  const isDisable = getQuotationByProject.data?.data.status === "approved";

  const onUpdateSellingPrice = (data: QuotationSchemaType) => {
    updateSellingPriceQuotationByProject.mutate(
      {
        project_id: props.id!,
        ...data,
      },
      {
        onSuccess: () => {
          notifications.show({
            title: "สําเร็จ",
            message: "แก้ไขราคาสําเร็จ",
            color: "green",
          });
          getQuotationByProject.refetch();
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
  };

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
        {status === 'approved' ? (
          <CheckCircle size={14} className="text-green-600" />
        ) : (
          <AlertCircle size={14} className="text-yellow-600" />
        )}
        {getQuotationStatusMap(status ?? "")?.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className=" px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <BackButton
            label="ย้อนกลับ"
            href={`/project/${props.id}`}
          />

          <div className="mt-6 flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">
                  ใบเสนอราคา
                </h1>
                <StatusBadge status={getQuotationByProject.data?.data.status ?? 'unknown'} />
              </div>
              <Text className="text-base text-gray-600">
                {getProjectApi.data?.data.name}
              </Text>
            </div>

            <div className="flex items-center gap-3">
              {isDisable ? (
                <a
                  target="_blank"
                  href={`/api/report/quotation/${props.id}?user_id=${session?.user.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all hover:bg-gray-50"
                >
                  <FileText size={16} />
                  Export
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400"
                >
                  <FileText size={16} />
                  Export
                </button>
              )}

              <Button
                disabled={isDisable}
                onClick={onChangeStatus}
                size="md"
                leftSection={<ArrowRight size={16} />}
                className={`${isDisable
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                เปลี่ยนสถานะ
              </Button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <QuotationForm
            project_id={props.id ?? ""}
            type="edit"
            onFinish={onUpdateSellingPrice}
          />
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
