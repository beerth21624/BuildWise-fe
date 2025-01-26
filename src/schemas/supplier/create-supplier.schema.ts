import { type z } from "zod";
import { supplierSchema } from "./supplier.schema";

export const createSupplierSchema = supplierSchema;

export type CreateSupplierSchemaType = z.infer<typeof createSupplierSchema>;
