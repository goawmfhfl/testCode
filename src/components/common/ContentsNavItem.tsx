import React from "react";
import styled, { css } from "styled-components/macro";

const ContentsNavItem = ({
  children,
  selected,
}: {
  children: React.ReactNode;
  selected?: boolean | undefined;
}) => {
  return <Container selected={selected}>{children}</Container>;
};

const selectedNavItemStyle = css`
  border-bottom: ${({ theme: { palette } }) => `1px solid ${palette.grey500}`};
`;

const Container = styled.div<{ selected: boolean | undefined }>`
  ${({ selected }) => (selected ?? false ? selectedNavItemStyle : "")};

  font-family: Spoqa Han Sans Neo;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.015em;
`;

export default ContentsNavItem;
