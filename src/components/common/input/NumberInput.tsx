import styled from "styled-components/macro";

const NumberInput = styled.input.attrs({
  type: "number",
})<{
  disabled?: boolean;
  width?: string;
  hasHandle?: boolean;
}>`
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  width: ${({ width }) => width};
  height: 32px;
  background-color: ${({ disabled, theme: { palette } }) =>
    disabled ? palette.grey100 : ""};

  padding: 7px 8px;
  margin-right: 8px;

  font-size: 12px;
  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;
  line-height: 18px;

  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")}; ;
`;

export default NumberInput;
