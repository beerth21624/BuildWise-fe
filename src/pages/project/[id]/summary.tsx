import BackButton from "@/components/BackButton/BackButton";
import useGetProject from "@/hooks/queries/project/useGetProject";
import { Button, Card, NumberFormatter, Text, Tooltip } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { BarChart } from "@mantine/charts";
import { FieldLabel } from "@/components/FieldLabel/FieldLabel";
import useGetBoqFromProject from "@/hooks/queries/boq/useGetBoqFromProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import useGetOverviewProject from "@/hooks/queries/project/useGetOverviewProject";
import useGetSummaryProject from "@/hooks/queries/project/useGetSummaryProject";
import { DataTable } from "mantine-datatable";
import Link from "next/link";
import {
  FileText,
  Building2,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Calculator,
  ChevronRight,
  BarChart3,
  Info,
  Loader2
} from 'lucide-react';
export default function Summary(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const getProject = useGetProject({ id: props.id! });
  const getBoqFromProject = useGetBoqFromProject({
    project_id: props.id ?? "",
  });
  const getQuoTationByProject = useGetQuotationByProject({
    project_id: props.id ?? "",
  });
  const getOverviewProject = useGetOverviewProject({ id: props.id ?? "" });
  const getSummaryProject = useGetSummaryProject({ id: props.id ?? "" });

  const StatCard = ({
    title,
    value,
    previousValue,
    icon: Icon,
    trend = 0,
    prefix = "฿",
    loading = false
  }: {
    title: string;
    value: number;
    previousValue?: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    trend?: number;
    prefix?: string;
    loading?: boolean;
  }) => {
    const percentChange = previousValue
      ? ((value - previousValue) / previousValue) * 100
      : 0;

    return (
      <Card
        withBorder
        className="group relative flex-1 overflow-hidden transition-all duration-200 hover:shadow-lg"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Text className="text-sm font-medium text-gray-500">{title}</Text>
              <Tooltip label="คลิกเพื่อดูรายละเอียดเพิ่มเติม" position="right">
                <Info size={14} className="text-gray-400" />
              </Tooltip>
            </div>

            {loading ? (
              <div className="mt-2 flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="text-sm text-gray-400">กำลังโหลด...</span>
              </div>
            ) : (
              <>
                <Text className="mt-2 text-2xl font-semibold text-gray-900">
                  {prefix}
                  <NumberFormatter
                    value={value?.toFixed(2)}
                    thousandSeparator
                  />
                </Text>
                {previousValue && (
                  <div className={`mt-2 flex items-center gap-1 text-sm ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {percentChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>{Math.abs(percentChange).toFixed(1)}%</span>
                    <span className="text-gray-500">จากเดือนที่แล้ว</span>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="rounded-xl bg-gray-50 p-2 text-gray-400 transition-colors group-hover:bg-gray-100 group-hover:text-gray-500">
            <Icon width={20} height={20} />
          </div>
        </div>
      </Card>
    );
  };


  const TableHeader = ({ children }: { children: React.ReactNode }) => (
    <Text className="font-medium text-gray-600">{children}</Text>
  );

  const NumberCell = ({
    value,
    previousValue,
    type = 'neutral'
  }: {
    value: number;
    previousValue?: number;
    type?: 'profit' | 'cost' | 'neutral';
  }) => {
    const percentChange = previousValue
      ? ((value - previousValue) / previousValue) * 100
      : 0;

    const getColorClass = () => {
      if (type === 'profit') return value >= 0 ? 'text-green-600' : 'text-red-600';
      if (type === 'cost') return previousValue !== undefined && value <= previousValue ? 'text-green-600' : 'text-red-600';
      return 'text-gray-900';
    };

    return (
      <div className="flex items-center justify-end gap-2">
        <Text className={`tabular-nums font-medium ${getColorClass()}`}>
          ฿{new Intl.NumberFormat('th-TH').format(value)}
        </Text>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <BackButton
            label="ย้อนกลับไปหน้ารายละเอียดโครงการ"
            href={`/project/${props.id}`}
          />

          <div className="mt-6 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-gray-400" />
                <Text className="text-2xl font-semibold text-gray-900">
                  สรุปภาพรวมโครงการ
                </Text>
              </div>
              <Text className="pl-11 text-base text-gray-600">
                {getProject.data?.data.name}
              </Text>
            </div>

            <a
              href={`/api/report/summary/${props.id}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg bg-white/50 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300/50 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
            >
              <FileText size={16} />
              Export รายงาน
            </a>
          </div>
        </div>

        {/* Project Info Card */}
        <Card
          withBorder
          className="relative mb-6 overflow-hidden bg-white/70 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 opacity-50" />
          <div className="relative space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white p-2 shadow-sm">
                <Building2 size={24} className="text-blue-500" />
              </div>
              <div>
                <Text className="text-xl font-semibold text-gray-900">
                  {getSummaryProject.data?.data.project_name}
                </Text>
                <Text className="mt-1 text-gray-600">
                  {getProject.data?.data.description}
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} className="text-gray-400" />
              <Text>
                {getProject.data?.data.address.address},{" "}
                {getProject.data?.data.address.subdistrict},{" "}
                {getProject.data?.data.address.district},{" "}
                {getProject.data?.data.address.province},{" "}
                {getProject.data?.data.address.postal_code}
              </Text>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="ต้นทุนประเมินรวม"
            value={getOverviewProject.data?.data.total_overall_cost ?? 0}
            icon={Calculator}
          />
          <StatCard
            title="ราคาขาย"
            value={getOverviewProject.data?.data.total_selling_price ?? 0}
            icon={DollarSign}
          />
          <StatCard
            title="ราคาขายรวมภาษี"
            value={getOverviewProject.data?.data.total_with_tax ?? 0}
            icon={DollarSign}
          />
          <StatCard
            title="กำไรประเมิน"
            value={getOverviewProject.data?.data.estimated_profit ?? 0}
            icon={TrendingUp}
          />
          <StatCard
            title="ต้นทุนจริงรวม"
            value={getOverviewProject.data?.data.total_actual_cost ?? 0}
            icon={Calculator}
          />
          <StatCard
            title="กำไรจริง"
            value={getOverviewProject.data?.data.actual_profit ?? 0}
            icon={TrendingUp}
          />
        </div>

        {/* Jobs Table */}
        <Card withBorder className="overflow-hidden bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <Text className="text-lg font-medium text-gray-900">รายละเอียดงานทั้งหมด</Text>
          </div>

          <DataTable
            classNames={{
              root: "rounded-lg",
              header: "bg-gray-50/50 border-b border-gray-200 py-3",
              table: "min-w-full divide-y divide-gray-200",
            }}
            minHeight={200}
            records={getSummaryProject.data?.data.jobs}
            columns={[
              {
                accessor: "job_name",
                title: <TableHeader>ชื่องาน</TableHeader>,
                render: (record) => (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <Text className="font-medium text-gray-900">
                      {record.job_name}
                    </Text>
                  </div>
                )
              },
              {
                accessor: "quantity",
                title: <TableHeader>จำนวน</TableHeader>,
                render: (record) => (
                  <div className="text-right font-medium text-gray-900">
                    {new Intl.NumberFormat('th-TH').format(record.quantity)} {record.unit}
                  </div>
                )
              },
              {
                accessor: "overall_cost",
                title: <TableHeader>ต้นทุนประเมิน/หน่วย</TableHeader>,
                render: (record) => (
                  <NumberCell
                    value={record.overall_cost}
                    type="cost"
                  />
                )
              },
              {
                accessor: "selling_price",
                title: <TableHeader>ราคาขาย/หน่วย</TableHeader>,
                render: (record) => (
                  <NumberCell
                    value={record.selling_price}
                  />
                )
              },
              {
                accessor: "estimated_profit",
                title: <TableHeader>กำไรประเมิน/หน่วย</TableHeader>,
                render: (record) => (
                  <NumberCell
                    value={record.estimated_profit}
                    type="profit"
                  />
                )
              },
              {
                accessor: "actual_overall_cost",
                title: <TableHeader>ต้นทุนจริง/หน่วย</TableHeader>,
                render: (record) => (
                  <NumberCell
                    value={record.actual_overall_cost}
                    previousValue={record.overall_cost}
                    type="cost"
                  />
                )
              },
              {
                accessor: "actual_profit",
                title: <TableHeader>กำไรจริง/หน่วย</TableHeader>,
                render: (record) => (
                  <NumberCell
                    value={record.actual_profit}
                    previousValue={record.estimated_profit}
                    type="profit"
                  />
                )
              },
              {
                accessor: "total_actual_profit",
                title: <TableHeader>กำไรจริงรวม</TableHeader>,
                render: (record) => (
                  <NumberCell
                    value={record.actual_profit * record.quantity}
                    type="profit"
                  />
                )
              }
            ]}
          />
        </Card>
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
