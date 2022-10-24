import { useEffect } from "react";
import styled from "styled-components/macro";
import { useFormContext, UseFormRegisterReturn } from "react-hook-form";

import downwordArrowMedium from "@icons/arrow-downward-medium.svg";
import downwordArrowBig from "@icons/arrow-downward-big.svg";
import { useEffect } from "react";

interface arrowSetType {
  small: string;
  medium: string;
  big: string;
}

const arrowSet: arrowSetType = {
  small: "",
  medium: downwordArrowMedium,
  big: downwordArrowBig,
};

const Dropdown = ({
  size,
  width,
  options,
  register,
  disabled,
}: {
  size: string;
  width?: string;
  options:
    | Array<{
        name: string;
        value: string | number | Array<string>;
        selected?: boolean;
      }>
    | undefined;
  register: UseFormRegisterReturn;
  disabled?: boolean;
}) => {
  return (
    <Select
      register={register}
      size={size}
      width={width}
      disabled={disabled}
      defaultValue={options.find((el) => el.selected).value}
    >
      {options.map(({ name, value }) => {
        return (
          <Option key={`${name}`} value={value}>
            {name}
          </Option>
        );
      })}
    </Select>
  );
};

const Select = ({
  size,
  width,
  children,
  register,
  disabled,
  defaultValue,
}: {
  size: string;
  width?: string;
  children: React.ReactNode;
  register: UseFormRegisterReturn;
  disabled?: boolean;
  defaultValue: string | number | Array<string>;
}) => {
  const downwardArrowSrc: string = arrowSet[size as keyof arrowSetType];

  const { watch, setValue } = useFormContext();

  const inputName = register.name;

  useEffect(() => {
    setValue(inputName, defaultValue);
  }, []);

  return (
    <SelectInput
      sizing={size}
      width={width}
      arrowSrc={downwardArrowSrc}
      {...register}
      disabled={disabled}
      defaultValue={watch(inputName) as string}
    >
      {children}
    </SelectInput>
  );
};

const Option = ({
  value,
  children,
}: {
  value: string | number | Array<string> | null;
  children: string;
}) => {
  return <OptionInput value={value}>{children}</OptionInput>;
};

interface SelectProps {
  sizing?: string;
  width?: string;
  arrowSrc: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const SelectInput = styled.select<SelectProps>`
  ${({ sizing, arrowSrc }) => {
    if (!sizing) return "";

    switch (sizing) {
      case "small":
        return "padding: 8px";
      case "medium":
        return `
          padding: 8px;
          height: 32px;
          background-image: url(${arrowSrc});
          background-repeat: no-repeat;
          background-position: right;

          font-weight: 500;
          font-size: 12px;
          line-height: 14px;
        `;
      case "big":
        return `
          min-width: 210px;
          padding: 15px 16px;
          background-image: url(${arrowSrc});
          background-repeat: no-repeat;
          background-position: right 16px bottom 50%;

          font-family: Spoqa Han Sans Neo;
          font-size: 16px;
          font-weight: 400;
          line-height: 18px;
          letter-spacing: -0.015em;
          text-align: left;
        `;
      default:
        return "";
    }
  }};

  font-family: "Spoqa Han Sans Neo";
  width: ${({ width }) => (width ? width : "")};
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  padding-right: 54px;
  background-color: #fff;
`;

export const OptionInput = styled.option`
  font-family: "Spoqa Han Sans Neo";
`;

export default Dropdown;
