import styled from "styled-components";

import Button from "@components/Button";

const EnterPreneur = () => {
  return (
    <Container>
      <SubTitleWrapper>
        <SubTitle>사업자 정보(간이,법인)</SubTitle>
      </SubTitleWrapper>
      {/* <HasNoInfoContainer>
        <InfoText>등록된 사업자등록증/통신판매업신고증이 없습니다.</InfoText>
        <Button size="small" full={false}>
          등록하기
        </Button>
      </HasNoInfoContainer> */}
      <HasInfoContainer>
        <EntrePreneurInfoList>
          <EntrepreneurInfoContainer>
            <EntrePreneurText>대표자명</EntrePreneurText>
            <EntrePreneurText>김지원</EntrePreneurText>
          </EntrepreneurInfoContainer>
          <EntrepreneurInfoContainer>
            <EntrePreneurText>사업자등록번호 </EntrePreneurText>
            <EntrePreneurText>123-45-12345</EntrePreneurText>
          </EntrepreneurInfoContainer>
          <EntrepreneurInfoContainer>
            <EntrePreneurText>법인등록번호</EntrePreneurText>
            <EntrePreneurText>해당사항없음</EntrePreneurText>
          </EntrepreneurInfoContainer>
          <EntrepreneurInfoContainer>
            <EntrePreneurText>간이과세대상자</EntrePreneurText>
            <EntrePreneurText>대상</EntrePreneurText>
          </EntrepreneurInfoContainer>
          <EntrepreneurInfoContainer>
            <EntrePreneurText>소재지</EntrePreneurText>
            <EntrePreneurText>
              서울특별시 종로구 새문안로 3길 3, 내일신문빌딩 5층
            </EntrePreneurText>
          </EntrepreneurInfoContainer>
          <EntrepreneurInfoContainer>
            <EntrePreneurText>통신판매업신고번호</EntrePreneurText>
            <EntrePreneurText>2020-서울송파-3260</EntrePreneurText>
          </EntrepreneurInfoContainer>
        </EntrePreneurInfoList>
      </HasInfoContainer>
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

const HasNoInfoContainer = styled.div`
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

const HasInfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 736px;
  padding: 24px 40px;
  background-color: ${({ theme: { palette } }) => palette.grey100};
`;

const EntrePreneurInfoList = styled.ul`
  display: flex;
  flex-direction: column;
`;
const EntrepreneurInfoContainer = styled.li`
  display: flex;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${({ theme: { palette } }) => palette.grey500};

  & > :first-child {
    width: 170px;
  }
`;

const EntrePreneurText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: -0.03em;
`;

const InfoText = styled.h3`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.1px;
`;

export default EnterPreneur;
