import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import { UseFormRegisterReturn } from "react-hook-form";
import { v4 as uuid } from "uuid";

import downwordArrowMedium from "@icons/arrow-downward-medium.svg";
import downwordArrowBig from "@icons/arrow-downward-big.svg";

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

interface OptionType {
  key: string;
  text: string;
}

const Dropdown = ({
  size,
  width,
  options,
  register,
  disabled,
}: {
  size: string;
  width?: string;
  options: Array<string> | undefined;
  register: UseFormRegisterReturn;
  disabled?: boolean;
}) => {
  const [dropdownOptions, setDropdownOptions] = useState<Array<OptionType>>([]);

  useEffect(() => {
    if (!options) return;

    const mappedOptions: Array<OptionType> = options.map((option) => {
      const key: string = uuid();

      return {
        key,
        text: option,
      };
    });

    setDropdownOptions(mappedOptions);
  }, [options]);

  return (
    <Select register={register} size={size} width={width} disabled={disabled}>
      {dropdownOptions.map(({ key, text }) => {
        return <Option key={key}>{text}</Option>;
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
}: {
  size: string;
  width?: string;
  children: React.ReactNode;
  register: UseFormRegisterReturn;
  disabled?: boolean;
}) => {
  const downwardArrowSrc: string = arrowSet[size as keyof arrowSetType];

  return (
    <SelectInput
      sizing={size}
      width={width}
      arrowSrc={downwardArrowSrc}
      {...register}
      disabled={disabled}
    >
      {children}
    </SelectInput>
  );
};

const Option = ({ children }: { children: string }) => {
  return <OptionInput>{children}</OptionInput>;
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

  width: ${({ width }) => (width ? width : "")};
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  padding-right: 54px;
`;

export const OptionInput = styled.option``;

export default Dropdown;
