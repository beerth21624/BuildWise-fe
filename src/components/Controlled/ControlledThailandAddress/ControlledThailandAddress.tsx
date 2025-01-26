import { type AddressSchemaType } from "@/schemas/address.schema";
import dynamic from "next/dynamic";
import { type Control } from "react-hook-form";

const ControlledThailandAddressRoot = dynamic(
  () => import("./ControlledThailandAddressRoot"),
  { ssr: false },
);

interface Props {
  control: Control<AddressSchemaType>;
}

export default function ControlledThailandAddress(props: Props) {
  return <ControlledThailandAddressRoot control={props.control} />;
}
