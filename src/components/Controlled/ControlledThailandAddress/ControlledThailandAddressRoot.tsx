"use client";
import { Input, Menu } from "@mantine/core";
import clsx from "clsx";
import { useController, type Control } from "react-hook-form";
import { ThailandAddressTypeahead } from "react-thailand-address-typeahead";
import Highlighter from "react-highlight-words";
import { type AddressSchemaType } from "@/schemas/address.schema";
import ControlledInputText from "../ControlledInputText";
import { IconMapPin } from "@tabler/icons-react";

interface Props {
  control: Control<AddressSchemaType>;
}

export default function ControlledThailandAddressRoot(props: Props) {
  const subdistrictController = useController({
    control: props.control,
    name: "subdistrict",
  });
  const districtController = useController({
    control: props.control,
    name: "district",
  });

  const provinceController = useController({
    control: props.control,
    name: "province",
  });

  const postalCodeController = useController({
    control: props.control,
    name: "postal_code",
  });

  const inputClass =
    "py-[0.35rem] px-3 border border-zinc-300 w-full rounded-[0.5rem] focus:outline-primary focus:outline-[0px]";

  return (
    <div className="flex flex-col gap-5">
      <ControlledInputText
        props={{
          label: "ที่อยู่",
          placeholder: "กรอกที่อยู่",
          withAsterisk: true,
          leftSection: <IconMapPin size={15} />,
        }}
        control={props.control}
        name="address"
      />
      <ThailandAddressTypeahead
        value={{
          subdistrict: subdistrictController.field.value,
          district: districtController.field.value,
          province: provinceController.field.value,
          postalCode: postalCodeController.field.value,
        }}
        onValueChange={(val) => {
          subdistrictController.field.onChange(val.subdistrict);
          districtController.field.onChange(val.district);
          provinceController.field.onChange(val.province);
          postalCodeController.field.onChange(val.postalCode);
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <Input.Wrapper
              withAsterisk
              label="ตำบล / แขวง"
              className="w-full"
              error={
                subdistrictController.fieldState.error
                  ? subdistrictController.fieldState.error.message
                  : undefined
              }
            >
              <ThailandAddressTypeahead.SubdistrictInput
                className={clsx(
                  inputClass,
                  subdistrictController.fieldState.error
                    ? "mb-1 border-red-500"
                    : "",
                )}
                placeholder="ตำบล / แขวง"
              />
            </Input.Wrapper>
            <Input.Wrapper
              withAsterisk
              className="w-full"
              label="อำเภอ / เขต"
              error={
                districtController.fieldState.error
                  ? districtController.fieldState.error.message
                  : undefined
              }
            >
              <ThailandAddressTypeahead.DistrictInput
                className={clsx(
                  inputClass,
                  districtController.fieldState.error
                    ? "mb-1 border-red-500"
                    : "",
                )}
                placeholder="อำเภอ / เขต"
              />
            </Input.Wrapper>
          </div>
          <div className="flex gap-3">
            <Input.Wrapper
              withAsterisk
              className="w-full"
              label="จังหวัด"
              error={
                provinceController.fieldState.error
                  ? provinceController.fieldState.error.message
                  : undefined
              }
            >
              <ThailandAddressTypeahead.ProvinceInput
                className={clsx(
                  inputClass,
                  provinceController.fieldState.error
                    ? "mb-1 border-red-500"
                    : "",
                )}
                placeholder="จังหวัด"
              />
            </Input.Wrapper>
            <Input.Wrapper
              className="w-full"
              withAsterisk
              label="รหัสไปรษณีย์"
              error={
                postalCodeController.fieldState.error
                  ? postalCodeController.fieldState.error.message
                  : undefined
              }
            >
              <ThailandAddressTypeahead.PostalCodeInput
                className={clsx(
                  inputClass,
                  postalCodeController.fieldState.error
                    ? "mb-1 border-red-500"
                    : "",
                )}
                placeholder="รหัสไปรษณีย์"
              />
            </Input.Wrapper>
          </div>
        </div>
        <ThailandAddressTypeahead.CustomSuggestion>
          {(suggestions, shouldDisplaySuggestion, onSuggestionSelected) => {
            if (!shouldDisplaySuggestion) {
              return null;
            }
            return (
              <div className="absolute z-50 flex flex-col gap-1 rounded-b-md border bg-white shadow-md">
                {suggestions.map((ds, i) => (
                  <div
                    onMouseDown={() => onSuggestionSelected(ds)}
                    key={i}
                    className="cursor-pointer px-2 py-1 hover:bg-zinc-200"
                  >
                    <Highlighter
                      highlightClassName="font-extrabold bg-transparent text-primary"
                      unhighlightClassName="bg-transparent text-zinc-600"
                      searchWords={[
                        subdistrictController.field.value,
                        districtController.field.value,
                        provinceController.field.value,
                        postalCodeController.field.value,
                      ]}
                      autoEscape={true}
                      textToHighlight={`${ds.subdistrict} / ${ds.district} / ${ds.province} / ${ds.postalCode}`}
                    />
                  </div>
                ))}
              </div>
            );
          }}
        </ThailandAddressTypeahead.CustomSuggestion>
      </ThailandAddressTypeahead>
    </div>
  );
}
