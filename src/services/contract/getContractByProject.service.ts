import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Data {
  contract_id: string;
  project_id: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

export type GetContractByProjectProps = {
  project_id: string;
};

const getContractByProject = async (props: GetContractByProjectProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(
      `/contracts/${props.project_id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getContractByProject;
