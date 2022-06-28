import styled from "styled-components";

interface NoticeContainerType {
  icon: string;
  children: React.ReactNode;
}

const NoticeContainer = ({ children, icon }: NoticeContainerType) => {
  return (
    <Container>
      <Image src={icon} />
      <NoticeText>{children}</NoticeText>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  padding: 12px 16px 8px 11px;
  border-radius: 7px;
  background: ${({ theme: { palette } }) => palette.grey400};
  margin-bottom: 12px;
`;
const NoticeText = styled.p`
  display: flex;
  align-items: center;
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
