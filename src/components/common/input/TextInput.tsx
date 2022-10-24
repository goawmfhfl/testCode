import React from "react";
import styled from "styled-components/macro";
import { UseFormRegisterReturn, useFormContext } from "react-hook-form";

import { isNumber } from "@utils/index";

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
  const { setValue } = useFormContext();

  const preventNaNValues = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const {
      nativeEvent: { altKey, metaKey, shiftKey },
    } = e;

    const hasMetaComposing = altKey || metaKey || shiftKey;

    if (
      e.key === "Backspace" ||
      e.key === "Tab" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowLeft" ||
      e.key === "Meta" ||
      e.key === "Alt" ||
      hasMetaComposing
    ) {
      return;
    }

    if (!isNumber(e.key)) {
      e.preventDefault();

      return;
    }
  };

  const changeVacancyToZero = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setValue(register.name, 0);
    }
  };

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
      // eslint-disable-next-line
      onBlur={numbersOnly ? changeVacancyToZero : () => {}}
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
