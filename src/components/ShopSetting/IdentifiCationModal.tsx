// padding & margin 작업 해야합니다.
import React from "react";
import styled from "styled-components";

import deleteSrc from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark-red.svg";
import NoticeContainer from "@components/NoticeContainer";
import Button from "@components/Button";
import Input from "@components/Input";

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
          -
          <Input />
        </InputContainer>
      </IdContainer>
      <DateContainer>
        <SubTitle>발급일자</SubTitle>
        <Input />
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

  padding: 40px 24px 24px 24px;
  display: flex;
  flex-direction: column;

  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  background-color: ${({ theme: { palette } }) => palette.white};
  box-shadow: ${({ theme: { shadow } }) => shadow.boxShadow};

  & > h2 {
    margin: 0px auto 24px;
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
  margin-bottom: 58px;
`;
const NameContainer = styled.div`
  display: flex;
`;
const IdContainer = styled.div`
  display: flex;
`;
const DateContainer = styled.div`
  display: flex;
`;
const SubTitle = styled.h3``;

const InputContainer = styled.div`
  display: flex;
`;
const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;

  & > button {
    margin-right: 16px;

    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

export default IdentifiCationModal;
