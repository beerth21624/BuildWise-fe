import deleteInvoiceByProject from "@/services/invoice/deleteInvoiceByProject.service";
import { useMutation } from "@tanstack/react-query";

const useDeleteInvoiceByProject = () => {
  return useMutation({
    mutationFn: deleteInvoiceByProject,
  });
};

export default useDeleteInvoiceByProject;
