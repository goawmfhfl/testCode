import { useState, useEffect } from "react";
import styled from "styled-components";
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
  options,
}: {
  size: string;
  options: Array<string>;
}) => {
  const [dropdownOptions, setDropdownOptions] = useState<Array<OptionType>>([]);

  useEffect(() => {
    const mappedOptions: Array<OptionType> = options.map((option) => {
      const key: string = uuid();

      return {
        key,
        text: option,
      };
    });

    setDropdownOptions(mappedOptions);
  }, []);

  return (
    <Select size={size}>
      {dropdownOptions.map(({ key, text }) => {
        return <Option key={key}>{text}</Option>;
      })}
    </Select>
  );
};

const Select = ({
  size,
  children,
}: {
  size: string;
  children: React.ReactNode;
}) => {
  const downwardArrowSrc: string = arrowSet[size as keyof arrowSetType];

  return (
    <SelectInput sizing={size} arrowSrc={downwardArrowSrc}>
      {children}
    </SelectInput>
  );
};

const Option = ({ children }: { children: string }) => {
  return <OptionInput>{children}</OptionInput>;
};

interface SelectProps {
  sizing?: string;
  arrowSrc: string;
}

const SelectInput = styled.select<SelectProps>`
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
        `;
      case "big":
        return `
          min-width: 210px;
          padding: 15px 16px;
          background-image: url(${arrowSrc});
          background-repeat: no-repeat;
          background-position: right 16px bottom 50%;
        `;
      default:
        return "";
    }
  }};

  border: 1px solid ${({ theme: { palette } }) => palette.grey500};

  padding-right: 54px;
`;

export const OptionInput = styled.option``;

export default Dropdown;
