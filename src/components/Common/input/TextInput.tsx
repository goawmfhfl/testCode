import { UseFormRegisterReturn } from "react-hook-form";
import styled from "styled-components";

const TextInput = ({
  width,
  textAlign,
  disabled,
  register,
}: {
  width?: string;
  textAlign?: string;
  value?: string;
  disabled?: boolean;
  register: UseFormRegisterReturn;
}) => {
  return (
    <Input
      type="text"
      width={width}
      textAlign={textAlign}
      disabled={disabled}
      {...register}
    />
  );
};
// TODO: 현재 구현되어 있는 small 스타일 외에, medium과 big 구현 필요
const Input = styled.input<{
  textAlign: string | undefined;
  disabled?: boolean;
}>`
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  width: ${({ width }) => width};
  height: 32px;
  background-color: ${({ disabled, theme: { palette } }) =>
    disabled ? palette.grey100 : ""};

  padding: 7px 8px;
  margin-right: 8px;

  font-size: 12px;
  font-family: "SpoqaHanSansNeo";
  font-weight: 300;
  line-height: 18px;

  text-align: ${({ textAlign }) => textAlign};
`;

export default TextInput;
