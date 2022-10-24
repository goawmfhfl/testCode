import styled from "styled-components/macro";

const ValidText = styled.span<{ valid: boolean }>`
  font-family: "Spoqa Han Sans Neo";
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;

  color: ${({ valid, theme: { palette } }) =>
    valid ? palette.black : palette.red900};

  span.red-text {
    color: ${({ theme: { palette } }) => palette.red900};
  }
`;

export default ValidText;
