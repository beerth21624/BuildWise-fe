import getInvoicesByProject, {
  type GetInvoicesByProjectProps,
} from "@/services/invoice/getInvoicesByProject.service";
import { useQuery } from "@tanstack/react-query";

const useGetInvoicesByProject = (
  props: GetInvoicesByProjectProps,
  counter?: number,
) => {
  return useQuery({
    queryKey: ["useGetInvoicesByProject", props.project_id, counter],
    queryFn: () => getInvoicesByProject(props),
    enabled: !!props.project_id,
  });
};

export default useGetInvoicesByProject;
