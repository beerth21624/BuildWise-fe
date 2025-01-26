import ControlledInputText from "@/components/Controlled/ControlledInputText";
import {
  documentSchema,
  type DocumentSchemaType,
} from "@/schemas/document/document.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FileButton } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconUpload } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

interface Props {
  type: "create" | "edit";
  onFinish?: (data: DocumentSchemaType) => void;
  data?: DocumentSchemaType;
}

export default function DocumentForm(props: Props) {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentSchemaType>({
    resolver: zodResolver(documentSchema),
  });

  const onFinish = (data: DocumentSchemaType) => {
    props.onFinish?.(data);
  };

  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.data) {
      setValue("project_id", props.data.project_id);
    }
  }, [props.data, setValue]);

  const uploadFile = async (file: File | null) => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData);
      setValue("file_url", res.data.url as string);
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        notifications.show({
          title: "เกิดข้อผิดพลาด",
          message: error.message,
          color: "red",
        });
        setLoading(false);
      }
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
      <FileButton onChange={uploadFile} accept="application/pdf">
        {(props) => (
          <Button
            loading={Loading}
            leftSection={<IconUpload size={14} />}
            variant="outline"
            {...props}
          >
            Upload PDF
          </Button>
        )}
      </FileButton>
      <ControlledInputText
        control={control}
        name="file_url"
        props={{
          label: "URL ไฟล์",
          placeholder: "กรอก URL ไฟล์",
          withAsterisk: true,
        }}
      />
      <Button type="submit">
        {props.type === "create" ? "บันทึก" : "บันทึก"}
      </Button>
    </form>
  );
}
