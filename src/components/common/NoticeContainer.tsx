import styled from "styled-components/macro";

interface NoticeContainerType {
  icon: string;
  children: React.ReactNode;
  width?: string;
  isOneLiner?: boolean;
}

const NoticeContainer = ({
  children,
  icon,
  width,
  isOneLiner = false,
}: NoticeContainerType) => {
  return (
    <Container width={width}>
      <NoticeIcon src={icon} />
      <NoticeText hasTopMargin={!isOneLiner}>{children}</NoticeText>
    </Container>
  );
};

export const Container = styled.div<{ width: string }>`
  display: flex;

  width: ${({ width }) => (width ? width : "100%")};
  padding: 8px 16px 8px 8px;
  border-radius: 7px;
  background: ${({ theme: { palette } }) => palette.grey400};
`;

export const NoticeText = styled.div<{ hasTopMargin?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;

  margin-top: ${({ hasTopMargin }) => (hasTopMargin ? "4px" : "")};

  ${({ theme }) => theme.typo.korean.body.secondary.basic};

  white-space: nowrap;
`;

export const NoticeIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 12px;

  user-select: none;
`;

export default NoticeContainer;
