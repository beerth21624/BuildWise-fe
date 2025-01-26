import getContractByProject, {
  type GetContractByProjectProps,
} from "@/services/contract/getContractByProject.service";
import { useQuery } from "@tanstack/react-query";

const useGetContractByProject = (
  props: GetContractByProjectProps,
  counter?: number,
) => {
  return useQuery({
    queryKey: ["useGetContractByProject", props.project_id, counter],
    queryFn: () => getContractByProject(props),
    enabled: !!props.project_id,
  });
};

export default useGetContractByProject;
