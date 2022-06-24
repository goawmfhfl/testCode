import styled, { css } from "styled-components";

const sizeStyles = css<{ size: string }>`
  ${({ size }) =>
    size === "small" &&
    css`
      padding: 10px 16px;
    `}
  ${({ size }) =>
    size === "big" &&
    css`
      padding: 15px 20px;
    `}
`;

const Button = styled.button<{ full: boolean; size: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};

  width: ${({ full }) => (full ? "100%" : "")};
  ${sizeStyles}

  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  letter-spacing: -0.015em;

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
