import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Data {
  invoice_id: string;
  project_id: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

export type GetInvoicesByProjectProps = {
  project_id: string;
};

const getInvoicesByProject = async (props: GetInvoicesByProjectProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data[]>>(
      `/invoices/${props.project_id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getInvoicesByProject;
