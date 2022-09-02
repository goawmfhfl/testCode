import styled from "styled-components/macro";

const DateInput = styled.input.attrs({ type: "date" })<{ disabled?: boolean }>`
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  padding: 9px 8px;

  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;

  height: 32px;

  ${({ disabled, theme: { palette } }) =>
    disabled
      ? `
    background-color: ${palette.grey100};
  `
      : ""};
`;

export default DateInput;
