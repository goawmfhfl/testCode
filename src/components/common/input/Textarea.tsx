import { UseFormRegisterReturn } from "react-hook-form";
import styled, { css } from "styled-components/macro";

const Textarea = ({
  width,
  height,
  size,
  register,
  onFocus,
  onChange,
  placeholder,
  maxLength,
  value,
}: {
  width?: string;
  height?: string;
  size: string;
  register?: UseFormRegisterReturn;
  onFocus?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  maxLength?: number;
  value?: string;
}) => {
  return (
    <Container
      width={width}
      height={height}
      size={size}
      {...register}
      onFocus={onFocus}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
    />
  );
};

const fontSizing = css<{ size: string }>`
  ${({ size }) => {
    switch (size) {
      case "small":
        return `
          font-size: 12px;
          font-weight: 300;
          line-height: 18px;
        `;
      case "medium":
        return `
          font-size: 15px;
          font-weight: 400;
          line-height: 18px;
          letter-spacing: -0.015em;
        `;
      case "big":
        return `
          font-size: 12px;
          font-weight: 300;
          line-height: 18px;
          letter-spacing: 0.10000000149011612px;
        `;
    }
  }};
`;

const paddingSizing = css<{ size: string }>`
  ${({ size }) => {
    switch (size) {
      case "small":
        return `
          padding: 7px 8px;
        `;
      case "medium":
        return `
          padding: 16px;
        `;
      case "big":
        return `
          padding: 8px;
        `;
    }
  }};
`;

const Container = styled.textarea<{
  width: string | undefined;
  height: string | undefined;
  size: string;
}>`
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  resize: none;

  width: ${({ width }) => (width ? width : "")};
  height: ${({ height }) => (height ? height : "")};

  ${fontSizing}
  ${paddingSizing}

  font-family: "Spoqa Han Sans Neo";
  font-size: 12px;
  font-weight: 300;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

export default Textarea;
