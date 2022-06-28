import styled from "styled-components";

import Button from "@components/Button";

const EnterPreneurInfo = () => {
  return (
    <Container>
      <SubTitleWrapper>
        <SubTitle>사업자 정보(간이,법인)</SubTitle>
      </SubTitleWrapper>
      <PreneurInfoContainer>
        <InfoText>등록된 사업자등록증/통신판매업신고증이 없습니다.</InfoText>
        <Button size="small" full={false}>
          등록하기
        </Button>
      </PreneurInfoContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  padding: 88px 0px;
  border-bottom: 1px solid ${({ theme: { palette } }) => palette.grey400};
`;

const SubTitleWrapper = styled.div`
  min-width: 235px;
  padding-left: 56px;
`;
const SubTitle = styled.h2`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
`;

const PreneurInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 736px;
  padding: 16px 174px;
  background-color: ${({ theme: { palette } }) => palette.grey100};

  & > :first-child {
    margin-bottom: 16px;
  }

  & > button {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

const InfoText = styled.h3`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.1px;
`;

export default EnterPreneurInfo;
