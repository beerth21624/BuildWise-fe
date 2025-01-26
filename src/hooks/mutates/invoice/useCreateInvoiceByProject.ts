import createInvoiceByProject from "@/services/invoice/createInvoiceByProject.service";
import { useMutation } from "@tanstack/react-query";

const useCreateInvoiceByProject = () => {
  return useMutation({
    mutationFn: createInvoiceByProject,
  });
};

export default useCreateInvoiceByProject;
