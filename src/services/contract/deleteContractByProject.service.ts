import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type DeleteContractByProjectProps = {
  project_id: string;
};

const deleteContractByProject = async (props: DeleteContractByProjectProps) => {
  try {
    const res = await axiosAPI.delete<BaseResponse<object>>(
      `/contracts/${props.project_id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default deleteContractByProject;
