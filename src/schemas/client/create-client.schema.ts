import { type z } from "zod";
import { clientSchema } from "./client.schema";

export const createClientSchema = clientSchema;

export type CreateClientSchemaType = z.infer<typeof createClientSchema>;
