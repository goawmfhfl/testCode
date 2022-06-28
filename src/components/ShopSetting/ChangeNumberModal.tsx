import React from "react";
import styled from "styled-components";

import deleteSrc from "@icons/delete.svg";
import Input from "@components/Input";
import Button from "@components/Button";
import ValidText from "@components/ValidText";

const ChangeNumberModal = () => {
  return (
    <Container>
      <Icon src={deleteSrc} />
      <Title>전화번호 변경하기</Title>
      <DescriptText>변경할 전화번호를 입력해주세요</DescriptText>
      <ConfirmContainer>
        <PhoneNumberContainer>
          <Input placeholder="전화번호 - 제외하고 입력해주세요" />
          <Button size="small" full={false}>
            인증번호 재전송
          </Button>
        </PhoneNumberContainer>
        <AuthenticationCodeContainer>
          <Input />
          <Button size="small" full={false}>
            인증
          </Button>
          <CounterText>03:00</CounterText>
        </AuthenticationCodeContainer>
        <ValidText valid={false}>
          세션 시간이 만료되었습니다. 인증번호 재전송 버튼을 눌러 주세요.
        </ValidText>
      </ConfirmContainer>
      <ButtonContainer>
        <Button size="small" full={false} className="positive">
          확인
        </Button>
        <Button size="small" full={false}>
          취소
        </Button>
      </ButtonContainer>
    </Container>
  );
};

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
  & > h2 + span {
    margin-bottom: 12px;
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
const DescriptText = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
`;
const ConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-bottom: 32px;
`;
const PhoneNumberContainer = styled.div`
  display: flex;
  margin-bottom: 12px;

  & > input {
    width: 246px;
    margin-right: 8px;
    padding: 9px 8px;

    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.1px;
  }
  & > button {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;
const AuthenticationCodeContainer = styled.div`
  display: flex;
  margin-bottom: 12px;
  & > input {
    width: 246px;
    margin-right: 8px;
    padding: 9px 8px;

    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.1px;
  }
  & > button {
    margin-right: 8px;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }

  & > span {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const CounterText = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;
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

export default ChangeNumberModal;
