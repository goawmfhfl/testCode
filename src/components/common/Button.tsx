import styled, { css } from "styled-components/macro";

const sizeStyles = css<{ size: string }>`
  ${({ size }) =>
    size === "small" &&
    css`
      height: 32px;
      padding: 9px 16px;

      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      letter-spacing: 0.1px;
    `}

  ${({ size }) =>
    size === "big" &&
    css`
      height: 48px;
      padding: 15px 20px;

      font-weight: 400;
      font-size: 16px;
      line-height: 18px;
      letter-spacing: -0.015em;
    `}
`;

const Button = styled.button<{
  full?: boolean;
  width?: string;
  size: string;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  user-select: none;

  ${sizeStyles};

  width: ${({ full, width }) => (full ? "100%" : width ? width : "")};
  border: 1px solid
    ${({ backgroundColor, theme: { palette } }) =>
      backgroundColor ? backgroundColor : palette.grey500};
  color: ${({ color }) => (color ? color : "black")};

  background-color: ${({ backgroundColor }) =>
    backgroundColor ? backgroundColor : "transparent"};

  font-family: "Spoqa Han Sans Neo";
  word-break: keep-all;
  cursor: pointer;

  &.positive {
    background-color: ${({ theme: { palette } }) => palette.grey700};
    border: none;
    color: ${({ theme: { palette } }) => palette.white};
  }

  ${({ disabled, theme: { palette } }) =>
    disabled
      ? `
      background-color: ${palette.grey300} !important;
      border: none !important;
      color: ${palette.grey500} !important;

      cursor: default;
      pointer-events: none;
      `
      : ""};
`;

export default Button;
