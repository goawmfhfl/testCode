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
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid
    ${({ backgroundColor, theme: { palette } }) =>
      backgroundColor ? backgroundColor : palette.grey500};
  word-break: keep-all;
  color: ${({ color }) => (color ? color : "black")};
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? backgroundColor : "transparent"};
  font-family: "SpoqaHanSansNeo";

  width: ${({ full, width }) => (full ? "100%" : width ? width : "")};

  ${sizeStyles};

  &.positive {
    background-color: ${({ theme: { palette } }) => palette.grey700};
    border: none;
    color: ${({ theme: { palette } }) => palette.white};
  }

  &.negative {
    background-color: ${({ theme: { palette } }) => palette.grey300};
    border: none;
    color: ${({ theme: { palette } }) => palette.grey500};
  }
`;

export default Button;
