import styled from "styled-components";

const TextInput = ({ width }: { width?: string }) => {
  return <Input type="text" width={width} />;
};

// TODO: 현재 구현되어 있는 small 스타일 외에, medium과 big 구현 필요
const Input = styled.input`
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  width: ${({ width }) => width};
  padding: 7px 8px;
  margin-right: 8px;

  color: ${({ theme: { palette } }) => palette.grey500};
  font-size: 12px;
  font-family: "SpoqaHanSansNeo";
  font-weight: 300;
  line-height: 18px;

  height: 32px;
`;

export default TextInput;
