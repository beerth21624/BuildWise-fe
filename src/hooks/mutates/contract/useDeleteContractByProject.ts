import deleteContractByProject from "@/services/contract/deleteContractByProject.service";
import { useMutation } from "@tanstack/react-query";

const useDeleteContractByProject = () => {
  return useMutation({
    mutationFn: deleteContractByProject,
  });
};

export default useDeleteContractByProject;
