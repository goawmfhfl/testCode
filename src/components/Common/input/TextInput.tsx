import styled from "styled-components";

const TextInput = ({ width }: { width?: string }) => {
  return <Input type="text" width={width} />;
};

const Input = styled.input`
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  width: ${({ width }) => width};
  padding: 9px 8px;
`;

export default TextInput;
