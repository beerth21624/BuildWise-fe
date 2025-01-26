import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type CreateInvoiceByProjectProps = {
  project_id: string;
  file_url: string;
};

const createInvoiceByProject = async (props: CreateInvoiceByProjectProps) => {
  try {
    const data = _.omit(props, ["project_id"]);
    const res = await axiosAPI.post<BaseResponse<object>>(
      `/invoices/${props.project_id}`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default createInvoiceByProject;
