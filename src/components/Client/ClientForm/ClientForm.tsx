import BackButton from "@/components/BackButton/BackButton";
import ControlledInputBase from "@/components/Controlled/ControlledInputBase";
import ControlledInputText from "@/components/Controlled/ControlledInputText";
import ControlledThailandAddress from "@/components/Controlled/ControlledThailandAddress/ControlledThailandAddress";
import { AddressSchemaType } from "@/schemas/address.schema";
import {
  clientSchema,
  type ClientSchemaType,
} from "@/schemas/client/client.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text } from "@mantine/core";
import { useEffect } from "react";
import { Control, useForm } from "react-hook-form";

interface Props {
  type: "create" | "edit";
  onFinish?: (data: ClientSchemaType) => void;
  data?: ClientSchemaType;
}

export default function ClientForm(props: Props) {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientSchemaType>({
    resolver: zodResolver(clientSchema),
  });

  const onFinish = (data: ClientSchemaType) => {
    console.log(data);
    props.onFinish?.(data);
  };

  useEffect(() => {
    if (props.data) {
      setValue("name", props.data.name);
      setValue("email", props.data.email);
      setValue("phone", props.data.phone);
      setValue("tax_id", props.data.tax_id);
      setValue("address", props.data.address);
      setValue("subdistrict", props.data.subdistrict);
      setValue("district", props.data.district);
      setValue("province", props.data.province);
      setValue("postal_code", props.data.postal_code);
    }
  }, [props.data, setValue]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
      <div className="flex items-baseline gap-5">
        <ControlledInputText
          control={control}
          name="name"
          props={{
            label: "ชื่อ",
            placeholder: "กรอกชื่อ",
            withAsterisk: true,
          }}
        />
        <ControlledInputText
          control={control}
          name="email"
          props={{
            label: "อีเมล",
            placeholder: "กรอกอีเมล",
            withAsterisk: true,
          }}
        />
      </div>
      <div className="flex items-baseline gap-3">
        <ControlledInputText
          control={control}
          name="phone"
          props={{
            label: "เบอร์โทรติดต่อ",
            placeholder: "กรอกเบอร์โทรติดต่อ",
            withAsterisk: true,
          }}
        />
        <ControlledInputText
          control={control}
          name="tax_id"
          props={{
            label: "เลขประจำตัวผู้เสียภาษี",
            placeholder: "กรอกเลขประจำตัวผู้เสียภาษี",
            withAsterisk: true,
          }}
        />
      </div>
      <ControlledThailandAddress
        control={control as unknown as Control<AddressSchemaType>}
      />
      <Button type="submit">
        {props.type === "create" ? "สร้าง" : "บันทึก"}
      </Button>
    </form>
  );
}
