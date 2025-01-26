import createContractByProject from "@/services/contract/createContractByProject.service";
import { useMutation } from "@tanstack/react-query";

const useCreateContractByProject = () => {
  return useMutation({
    mutationFn: createContractByProject,
  });
};

export default useCreateContractByProject;
