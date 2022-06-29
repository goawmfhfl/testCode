import styled from "styled-components";

const Input = styled.input`
  display: flex;
  align-items: center;

  background: ${({ theme: { palette } }) => palette.white};
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};

  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;

  &::placeholder {
    color: ${({ theme: { palette } }) => palette.grey500};
  }
  &:focus {
    border: 1px solid ${({ theme: { palette } }) => palette.grey700};
    outline: 1px solid ${({ theme: { palette } }) => palette.grey700};
  }
`;

export default Input;
