import styled from "styled-components";

import NoticeContainer from "@components/NoticeContainer";
import exclamationmarkSrc from "@icons/exclamationmark-red.svg";
import Button from "@components/Button";

const SafetyInfo = () => {
  return (
    <Container>
      <SubTitleWrapper>
        <SubTitle>
          안전기준 적합
          <br />
          확인 검사 인증
        </SubTitle>
      </SubTitleWrapper>
      <SafetyContainer>
        <NoticeContainer icon={exclamationmarkSrc}>
          캔들, 디퓨저 판매 브랜드는 검사 인증을 완료해야 상품 등록시 카테고리
          설정에서 캔들, 디퓨저를 선택하실 수 있습니다.
        </NoticeContainer>
        <ConfirmContainer>
          <ConfirmInfoText>안전기준 적합 확인 검사 신고번호</ConfirmInfoText>
          {/* <ConfirmText>인증완료</ConfirmText> */}
          <Button size="small" full={false}>
            인증하기
          </Button>
        </ConfirmContainer>
      </SafetyContainer>
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
  width: 235px;
  padding-left: 56px;
`;
const SubTitle = styled.h2`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
`;
const SafetyContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 736px;

  & > :first-child {
    margin-bottom: 24px;
  }
`;

const ConfirmContainer = styled.div`
  display: flex;
  width: 702px;
  align-items: center;

  & > :first-child {
    margin-right: 12px;
  }

  & > span {
    margin-right: 12px;
  }

  & > button {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;
const ConfirmInfoText = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.1px;
`;
const ConfirmText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: ${({ theme: { palette } }) => palette.grey500};
`;

export default SafetyInfo;
