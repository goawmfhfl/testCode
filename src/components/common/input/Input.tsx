import styled from "styled-components";

export const Small = styled.input<{ width?: string }>`
  display: flex;
  align-items: center;

  width: ${({ width }) => (width ? width : "100%")};

  padding: 8px;
  background: ${({ theme: { palette } }) => palette.white};
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};

  color: ${({ theme: { palette } }) => palette.black};
  ${({ theme }) => theme.typo.korean.body.secondary.basic};

  &::placeholder {
    color: ${({ theme: { palette } }) => palette.grey500};
  }

  &:focus {
    border: 1px solid ${({ theme: { palette } }) => palette.grey700};
    outline: 1px solid ${({ theme: { palette } }) => palette.grey700};
  }
`;

export const Medium = styled.input<{ width?: string }>`
  display: flex;
  align-items: center;

  width: ${({ width }) => (width ? width : "100%")};

  padding: 14px 16px;
  background: ${({ theme: { palette } }) => palette.white};
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};

  color: ${({ theme: { palette } }) => palette.black};
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  letter-spacing: -0.015em;

  &::placeholder {
    color: ${({ theme: { palette } }) => palette.grey500};
  }

  &:focus {
    border: 1px solid ${({ theme: { palette } }) => palette.grey700};
    outline: 1px solid ${({ theme: { palette } }) => palette.grey700};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.palette.grey100};
    color: ${({ theme }) => theme.palette.grey500};
    pointer-events: none;
  }
`;
