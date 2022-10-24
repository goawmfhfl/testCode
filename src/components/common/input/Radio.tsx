import styled from "styled-components/macro";

export default styled.input.attrs({ type: "radio" })`
  width: 20px;
  height: 20px;

  accent-color: ${({ theme: { palette } }) => palette.grey700};
`;
