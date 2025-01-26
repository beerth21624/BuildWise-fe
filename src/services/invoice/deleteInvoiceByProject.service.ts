import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type DeleteInvoiceByProjectProps = {
  project_id: string;
  invoice_id: string;
};

const deleteInvoiceByProject = async (props: DeleteInvoiceByProjectProps) => {
  try {
    const res = await axiosAPI.delete<BaseResponse<object>>(
      `/invoices/${props.project_id}/${props.invoice_id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default deleteInvoiceByProject;
