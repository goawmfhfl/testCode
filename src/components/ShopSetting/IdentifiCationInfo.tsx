import React from "react";
import styled from "styled-components";

import exclamationmarkSrc from "@icons/exclamationmark-red.svg";
import NoticeContainer from "@components/NoticeContainer";
import Button from "@components/Button";

const IdentifiCationInfo = () => {
  return (
    <Container>
      <SubTitleWrapper>
        <SubTitle>
          개인판매자
          <br />
          주민등록증 인증
        </SubTitle>
      </SubTitleWrapper>
      <IdentifiCationInfoContainer>
        <NoticeContainer icon={exclamationmarkSrc}>
          사업자등록증 없이 판매하시는 경우 주민등록증 인증을 해주세요. 인증된
          주민등록번호는 정산에만 활용됩니다.
          <br />
          개인자격으로도 판매 가능하나 지속적으로 판매할 시 사업자등록을
          권유하며 주민등록증 사본 속 성함은 정산 계좌 정보의
          <br /> 예금주명과 같아야 합니다. (사업자 등록 번호를 등록하셨을 경우
          주민등록증 인증은 필수가 아닙니다.)
        </NoticeContainer>
        <InfoContainer>
          <InfoText>
            인증된 주민등록증이 없습니다.
            {/* 주민등록이 인증되었습니다. */}
          </InfoText>
          <Button size="small" full={false}>
            인증하기
          </Button>
        </InfoContainer>
      </IdentifiCationInfoContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  padding-bottom: 88px;
`;

const SubTitleWrapper = styled.div`
  padding-left: 56px;
  min-width: 235px;
`;
const SubTitle = styled.h2`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
`;

const IdentifiCationInfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 736px;

  & > :first-child {
    margin-bottom: 16px;
  }
`;
const InfoContainer = styled.div`
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

export default IdentifiCationInfo;
