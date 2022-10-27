import styled from "styled-components";

export const ThContainer = styled.div`
  display: flex;
  width: 100%;
  height: 40px;

  background-color: ${({ theme: { palette } }) => palette.grey400};
`;

export const Th = styled.div<{ width: number }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${({ width }) => `${width}%`};
  border-right: 1px solid ${({ theme: { palette } }) => palette.grey500};
  overflow: hidden;

  &:last-child {
    border-right: none;
  }

  font-family: "Spoqa Han Sans Neo";
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: center;
  white-space: nowrap;
`;

export const TbContainer = styled.div`
  width: 100%;
  background-color: ${({ theme: { palette } }) => palette.white};
  border-radius: 0px 0px 7px 7px;
`;

export const Tr = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${({ theme: { palette } }) => palette.grey500};

  &:last-child {
    border-bottom: none;
  }
`;

export const Td = styled.div<{ width: number }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${({ width }) => `${width}%`};
  height: 40px;

  border-right: 1px solid ${({ theme: { palette } }) => palette.grey500};

  &:last-child {
    border-right: none;
  }

  overflow: hidden;

  font-family: "Spoqa Han Sans Neo";
  font-size: 10px;
  font-weight: 300;
  line-height: 14px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;
