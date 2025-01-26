import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type CreateContractByProjectProps = {
  project_id: string;
  file_url: string;
};

const createContractByProject = async (props: CreateContractByProjectProps) => {
  try {
    const data = _.omit(props, ["project_id"]);
    const res = await axiosAPI.post<BaseResponse<object>>(
      `/contracts/${props.project_id}`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default createContractByProject;
