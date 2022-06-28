import React from "react";
import styled from "styled-components";

import deleteSrc from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark-red.svg";
import Input from "@components/Input";
import ValidText from "@components/ValidText";
import Button from "@components/Button";
import NoticeContainer from "@components/NoticeContainer";

const SafetyInfoModal = () => (
  <Container>
    <Icon src={deleteSrc} />
    <Title>안전기준 적합 확인 검사 신고번호 인증하기</Title>
    <NoticeContainer icon={exclamationmarkSrc}>
      캔들, 디퓨저 판매 창작자는 검사 인증을 완료해야 상품 등록시 카테고리
      설정에서
      <br />
      캔들, 디퓨저를 선택하실 수 있습니다.
    </NoticeContainer>
    <ConfirmContainer>
      <ConfirmText>안전기준 적합 확인 검사 신고번호</ConfirmText>
      <RegisterContainer>
        <InputContainer>
          <Input />
          <Button size="small" full={false}>
            인증
          </Button>
        </InputContainer>
        <ValidText valid={true}>인증되었습니다.</ValidText>
      </RegisterContainer>
    </ConfirmContainer>
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

  padding: 24px 48px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;

  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  background-color: ${({ theme: { palette } }) => palette.white};
  box-shadow: ${({ theme: { shadow } }) => shadow.boxShadow};

  & > h2 {
    margin-bottom: 24px;
  }
  & > h2 + div {
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

const ConfirmContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 58px;

  & > :first-child {
    margin-right: 16px;
  }
`;

const ConfirmText = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
`;

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  & > :first-child {
    padding-bottom: 8px;
  }
`;
const InputContainer = styled.div`
  display: flex;

  & > input {
    padding: 10px 16px;
    width: 168px;
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

export default SafetyInfoModal;
