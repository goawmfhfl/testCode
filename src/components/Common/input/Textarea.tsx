import styled from "styled-components";

export default styled.textarea<{ width: string; height: string }>`
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  resize: none;

  width: ${({ width }) => (width ? width : "")};
  height: ${({ height }) => (height ? height : "")};
`;
