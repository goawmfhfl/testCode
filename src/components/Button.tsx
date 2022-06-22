import styled, { css } from "styled-components";

const sizeStyles = css<{ size: string }>`
  ${(props) =>
    props.size === "small" &&
    css`
      padding: 10px 16px;
    `}
  ${(props) =>
    props.size === "big" &&
    css`
      padding: 15px 20px;
    `}
`;

const Button = styled.button<{ full: boolean; size: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => props.theme.palette["grey500"]};

  width: ${(props) => (props.full ? "100%" : "")};
  ${sizeStyles}

  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  letter-spacing: -0.015em;

  &.positive {
    background-color: ${(props) => props.theme.palette["grey700"]};
    border: none;
    color: ${(props) => props.theme.palette["white"]};
  }
  &.negative {
    background-color: ${(props) => props.theme.palette["grey300"]};
    border: none;
    color: ${(props) => props.theme.palette["grey500"]};
  }
`;

export default Button;
