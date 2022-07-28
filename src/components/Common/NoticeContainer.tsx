import styled from "styled-components/macro";

interface NoticeContainerType {
  icon: string;
  children: React.ReactNode;
  width?: string;
}

const NoticeContainer = ({ children, icon, width }: NoticeContainerType) => {
  return (
    <Container width={width}>
      <Image src={icon} />
      <NoticeText>{children}</NoticeText>
    </Container>
  );
};

const Container = styled.div<{ width: string }>`
  display: flex;
  width: ${({ width }) => (width ? width : "100%")};
  padding: 8px 16px 8px 8px;
  border-radius: 7px;
  background: ${({ theme: { palette } }) => palette.grey400};
`;

const NoticeText = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  padding-top: 4px;

  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;
`;

const Image = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 15px;
`;

export default NoticeContainer;
