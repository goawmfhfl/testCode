// padding & margin 작업 해야합니다.
import React from "react";
import styled from "styled-components";

import deleteSrc from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark-red.svg";
import NoticeContainer from "@components/Common/NoticeContainer";
import Button from "@components/Common/Button";
import Input from "@components/Common/Input";

const IdentifiCationModal = () => (
  <Container>
    <Icon src={deleteSrc} />
    <Title>주민등록증 인증하기</Title>
    <NoticeContainer icon={exclamationmarkSrc}>
      주민등록증은 정산받을 계좌 정보의 예금주명과 같아야 합니다.
    </NoticeContainer>
    <InfoContainer>
      <NameContainer>
        <SubTitle>성명</SubTitle>
        <Input />
      </NameContainer>
      <IdContainer>
        <SubTitle>주민등록번호</SubTitle>
        <InputContainer>
          <Input />
          <span>-</span>
          <Input />
        </InputContainer>
      </IdContainer>
      <DateContainer>
        <SubTitle>발급일자</SubTitle>
        <Input placeholder="YYYYMMDD" />
      </DateContainer>
    </InfoContainer>
    <ButtonContainer>
      <Button size="small" full={false} className="positive">
        저장
      </Button>
      <Button size="small" full={false}>
        취소
      </Button>
    </ButtonContainer>
  </Container>
);
const Container = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;

  display: flex;
  flex-direction: column;

  width: 530px;
  padding: 40px 24px 24px 24px;
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  background-color: ${({ theme: { palette } }) => palette.white};
  box-shadow: ${({ theme: { shadow } }) => shadow.boxShadow};

  & > h2 {
    margin-bottom: 24px;
  }
  & > h2 + div {
    width: 369px;
    margin-bottom: 24px;
  }
`;
const Icon = styled.img`
  position: absolute;
  top: 12.79px;
  right: 12.77px;
`;
const Title = styled.h2`
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;
`;
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const NameContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  & > h3 {
    width: 152px;
  }
  & > input {
    width: 120px;
    height: 32px;
    padding: 9px 8px;
  }
`;
const IdContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  & > h3 {
    width: 152px;
  }
`;
const DateContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  & > h3 {
    width: 152px;
  }

  & > input {
    width: 120px;
    height: 32px;
    padding: 9px 8px;
  }
`;
const SubTitle = styled.h3`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
`;
const InputContainer = styled.div`
  display: flex;

  & > input {
    width: 120px;
    height: 32px;
    padding: 9px 8px;
  }

  & > span {
    margin: auto 8px;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  & > button:first-child {
    margin-right: 16px;
  }
  & > button {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

export default IdentifiCationModal;
