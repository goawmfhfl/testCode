import styled from "styled-components";

const DateInput = styled.input.attrs({ type: "date" })`
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  padding: 9px 8px;

  font-family: "SpoqaHanSansNeo";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;

  height: 32px;
`;

export default DateInput;
