import { TableType } from "@models/index";
import styled, { css } from "styled-components/macro";

export const TableContainer = styled.div<{
  type: TableType;
  hasData?: boolean;
}>`
  display: flex;
  position: relative;
  width: 100%;

  ${({ type }) =>
    type === TableType.FIX &&
    css`
      flex-direction: column;
    `}

  ${({ type, hasData }) =>
    type === TableType.SCROLL && !hasData
      ? css`
          height: 500px;
        `
      : css``}
`;

export const FixedTable = styled.div<{ width: number }>`
  min-width: ${({ width }) => `${width}px`};
  border-right: 1px solid ${({ theme: { palette } }) => palette.grey500};
`;

interface ScrollTableProps {
  width: number;
  children: React.ReactNode;
}

export const ScrollTable = ({ width, children }: ScrollTableProps) => {
  return (
    <ScrollTableContainer>
      <WrapperContainer width={width}>{children}</WrapperContainer>
    </ScrollTableContainer>
  );
};

const ScrollTableContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: scroll;
`;

const WrapperContainer = styled.div<{ width: number }>`
  min-width: ${({ width }) => `${width}px`};
`;

export const ThContainer = styled.div`
  display: flex;
  width: 100%;
  height: 40px;

  background-color: ${({ theme: { palette } }) => palette.grey400};
`;

export const Th = styled.div<{
  width: number;
  isOneLiner?: boolean;
  type: TableType;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ isOneLiner }) =>
    !isOneLiner &&
    css`
      display: flex;
      flex-direction: column;
    `}

  min-width: ${({ width, type }) => {
    if (type === TableType.FIX) return `${width}%`;
    if (type === TableType.SCROLL) return `${width}px`;
  }};
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

export const TdContainer = styled.div`
  width: 100%;
  background-color: ${({ theme: { palette } }) => palette.white};
  border-radius: 0px 0px 7px 7px;
`;

export const Tr = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${({ theme: { palette } }) => palette.grey500};
`;

export const Td = styled.div<{ width: number; type: TableType }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${({ width, type }) => {
    if (type === TableType.FIX) return `${width}%`;
    if (type === TableType.SCROLL) return `${width}px`;
  }};

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
