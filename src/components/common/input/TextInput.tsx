import styled from "styled-components/macro";
import { UseFormRegisterReturn } from "react-hook-form";

import { preventNaNValues } from "@utils/index";

const TextInput = ({
  register,
  disabled,
  width,
  textAlign,
  maxLength,
  placeholder,
  numbersOnly,
}: {
  register: UseFormRegisterReturn;
  disabled?: boolean;
  width?: string;
  textAlign?: string;
  maxLength?: number;
  placeholder?: string;
  numbersOnly?: boolean;
}) => {
  return (
    <Input
      {...register}
      disabled={disabled}
      width={width}
      textAlign={textAlign}
      maxLength={maxLength}
      placeholder={placeholder}
      // eslint-disable-next-line
      onKeyDown={numbersOnly ? preventNaNValues : () => {}}
    />
  );
};

// TODO: 현재 구현되어 있는 small 스타일 외에, medium과 big 구현 필요
export const Input = styled.input.attrs({ type: "text" })<{
  textAlign?: string | undefined;
  disabled?: boolean;
  width?: string;
}>`
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  width: ${({ width }) => width};
  height: 32px;
  background-color: ${({ disabled, theme: { palette } }) =>
    disabled ? palette.grey100 : "#ffffff"};

  padding: 7px 8px;
  margin-right: 8px;

  font-size: 12px;
  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;
  line-height: 18px;

  text-align: ${({ textAlign }) => textAlign};

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    cursor: default;
  `};
`;

export default TextInput;
