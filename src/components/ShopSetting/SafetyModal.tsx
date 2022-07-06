/* eslint-disable */
import React, { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import X2JS from "x2js";

import deleteSrc from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark-red.svg";
import Input from "@components/Common/Input";
import ValidText from "@components/Common/ValidText";
import Button from "@components/Common/Button";
import NoticeContainer from "@components/Common/NoticeContainer";
import axios from "axios";

interface SafetyModalProps {
  onClickModalHandler: Dispatch<SetStateAction<boolean>>;
}

const SafetyModal = ({ onClickModalHandler }: SafetyModalProps) => {
  const [validationCode, setValidationCode] = useState<string>("");
  const [validation, setValidation] = useState<{
    isVerified: boolean;
    isWrongNumber: boolean;
  }>({
    isVerified: false,
    isWrongNumber: false,
  });

  const postAuthenticationCode = async (validationCode: string) => {
    // TODO: POST 요청을 진행한다.

    const parameter = {
      params: {
        AuthKey: "94476PQ3G6X632RTOQUS8N2Y9P62GAW9",
        ServiceName: "slfsfcfstChk",
        SlfsfcfstNo: "HB21-26-0192",
      },
    };

    const { data } = await axios.get(
      "https://ecolife.me.go.kr/openapi/TestSvl?idx=13",
      parameter
    );

    const x2js = new X2JS();
    const { rows } = x2js.xml2js(data);

    if (rows?.resultcode !== "0000") {
      setValidation(() => ({
        isVerified: false,
        isWrongNumber: true,
      }));
    } else {
      setValidation(() => ({
        isVerified: true,
        isWrongNumber: false,
      }));
    }
  };

  const { isVerified, isWrongNumber } = validation;

  return (
    <Container>
      <Icon src={deleteSrc} onClick={() => onClickModalHandler(false)} />
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
            <Input
              onChange={(event) => setValidationCode(event.target.value)}
            />
            <Button
              size="small"
              full={false}
              onClick={() => postAuthenticationCode(validationCode)}
            >
              인증
            </Button>
            {isVerified && (
              <ValidText valid={isVerified}>인증되었습니다.</ValidText>
            )}
            {isWrongNumber && (
              <ValidText valid={!isWrongNumber}>
                존재하지 않는 번호 입니다. 다시 확인해주세요.
              </ValidText>
            )}
          </InputContainer>
        </RegisterContainer>
      </ConfirmContainer>
      <ButtonContainer>
        <Button size="small" full={false} className="positive">
          저장
        </Button>
        <Button
          size="small"
          full={false}
          onClick={() => onClickModalHandler(false)}
        >
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
  & > p {
    background-color: #123;
  }
`;

const InputContainer = styled.div`
  display: flex;
  position: relative;

  & > input {
    padding: 9px 8px;
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

  & > p {
    position: absolute;
    transform: translateY(50%);
    top: 40px;
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

export default SafetyModal;
