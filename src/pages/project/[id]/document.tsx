import BackButton from "@/components/BackButton/BackButton";
import DocumentForm from "@/components/Document/DocumentForm/DocumentForm";
import { DeleteConfirmModalConfig } from "@/config/ConfirmModalConfig/ConfirmModalConfig";
import useCreateContractByProject from "@/hooks/mutates/contract/useCreateContractByProject";
import useDeleteContractByProject from "@/hooks/mutates/contract/useDeleteContractByProject";
import useCreateInvoiceByProject from "@/hooks/mutates/invoice/useCreateInvoiceByProject";
import useDeleteInvoiceByProject from "@/hooks/mutates/invoice/useDeleteInvoiceByProject";
import useGetContractByProject from "@/hooks/queries/contract/useGetContractByProject";
import useGetInvoicesByProject from "@/hooks/queries/invoice/useGetInvoicesByProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import { type DocumentSchemaType } from "@/schemas/document/document.schema";
import {
  ActionIcon,
  Button,
  Card,
  InputLabel,
  Modal,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCertificate, IconReceipt, IconX } from "@tabler/icons-react";
import { AxiosError } from "axios";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { useState } from "react";

export default function Document(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const [Counter, setCounter] = useState(0);
  const getProject = useGetProject({ id: props.id ?? "" });

  const [
    openedAddContract,
    { open: openAddContract, close: closeAddContract },
  ] = useDisclosure(false);

  const getContractByProject = useGetContractByProject(
    {
      project_id: props.id ?? "",
    },
    Counter,
  );

  const createContractByProject = useCreateContractByProject();
  const deleteContractByProject = useDeleteContractByProject();

  const getInvoicesByProject = useGetInvoicesByProject(
    {
      project_id: props.id ?? "",
    },
    Counter,
  );
  const createInvoiceByProject = useCreateInvoiceByProject();
  const deleteInvoiceByProject = useDeleteInvoiceByProject();

  const [openedAddInvoice, { open: openAddInvoice, close: closeAddInvoice }] =
    useDisclosure(false);

  const onAddContract = (data: DocumentSchemaType) => {
    createContractByProject.mutate(data, {
      onSuccess: () => {
        notifications.show({
          title: "สร้างสัญญาเรียบร้อย",
          message: "สร้างสัญญาเรียบร้อย",
          color: "green",
        });
        closeAddContract();
        getContractByProject.refetch();
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
    });
  };

  const onAddInvoice = (data: DocumentSchemaType) => {
    createInvoiceByProject.mutate(data, {
      onSuccess: () => {
        notifications.show({
          title: "สร้างใบแจ้งหนี้เรียบร้อย",
          message: "สร้างใบแจ้งหนี้เรียบร้อย",
          color: "green",
        });
        closeAddInvoice();
        getInvoicesByProject.refetch();
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
    });
  };

  const onDeleteContract = (data: DocumentSchemaType) => {
    modals.openConfirmModal({
      ...DeleteConfirmModalConfig,
      children: (
        <Text size="sm">
          คุณต้องการลบสัญญา <b>{data.file_url}</b> ใช่หรือไม่ ?
        </Text>
      ),
      onConfirm: () => {
        deleteContractByProject.mutate(
          { project_id: props.id! },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "ลบสัญญา สําเร็จ",
                color: "green",
              });
              setCounter((pre) => pre + 1);
              getContractByProject.refetch();
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

  type DeleteInvoiceProps = NonNullable<
    typeof getInvoicesByProject.data
  >["data"] extends (infer T)[] | null | undefined
    ? T
    : never;

  const onDeleteInvoice = (data: DeleteInvoiceProps) => {
    modals.openConfirmModal({
      ...DeleteConfirmModalConfig,
      children: (
        <Text size="sm">
          คุณต้องการลบใบแจ้งหนี้ <b>{data.file_url}</b> ใช่หรือไม่ ?
        </Text>
      ),
      onConfirm: () => {
        deleteInvoiceByProject.mutate(
          {
            project_id: props.id!,
            invoice_id: data.invoice_id,
          },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "ลบใบแจ้งหนี้ สําเร็จ",
                color: "green",
              });
              setCounter((pre) => pre + 1);
              getInvoicesByProject.refetch();
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
      <Modal
        opened={openedAddContract}
        onClose={closeAddContract}
        title="เพิ่มสัญญา"
      >
        <DocumentForm
          type="create"
          data={{ project_id: props.id!, file_url: "" }}
          onFinish={onAddContract}
        />
      </Modal>

      <Modal
        opened={openedAddInvoice}
        onClose={closeAddInvoice}
        title="เพิ่มใบแจ้งหนี้"
      >
        <DocumentForm
          type="create"
          data={{ project_id: props.id!, file_url: "" }}
          onFinish={onAddInvoice}
        />
      </Modal>
      <div className="flex flex-col gap-3">
        <BackButton label="ย้อนกลับไปหน้ารายละเอียดโครงการ" />
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Text size="xl" fw={700}>
              จัดการเอกสาร
            </Text>
            <Text size="md" fw={700}>
              {getProject.data?.data.name}
            </Text>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <InputLabel size="md">สัญญา</InputLabel>
            {!getContractByProject.data?.data && (
              <Button onClick={openAddContract} size="compact-xs">
                เพิ่ม
              </Button>
            )}
          </div>
          {getContractByProject.data?.data && (
            <Card withBorder>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <IconCertificate />
                  <a
                    href={getContractByProject.data.data.file_url}
                    target="_blank"
                  >
                    ใบสัญญา -{" "}
                    {getContractByProject.data.data.file_url.replace(
                      "https://assets.teerut.com/build-wise/",
                      "",
                    )}
                  </a>
                </div>
                <ActionIcon
                  onClick={() =>
                    onDeleteContract({
                      file_url: getContractByProject.data.data.file_url,
                      project_id: props.id!,
                    })
                  }
                  color="red"
                  variant="transparent"
                >
                  <IconX />
                </ActionIcon>
              </div>
            </Card>
          )}
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <InputLabel size="md">ใบแจ้งหนี้</InputLabel>
            <Button onClick={openAddInvoice} size="compact-xs">
              เพิ่ม
            </Button>
          </div>
          {getInvoicesByProject.data?.data.map((invoice, index) => (
            <Card withBorder key={index}>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <IconReceipt />
                  <a href={invoice.file_url} target="_blank">
                    ใบแจ้งหนี้ -{" "}
                    {invoice.file_url.replace(
                      "https://assets.teerut.com/build-wise/",
                      "",
                    )}
                  </a>
                </div>
                <ActionIcon
                  onClick={() => onDeleteInvoice(invoice)}
                  color="red"
                  variant="transparent"
                >
                  <IconX />
                </ActionIcon>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      id: context.query.id?.toString(),
    },
  };
}
