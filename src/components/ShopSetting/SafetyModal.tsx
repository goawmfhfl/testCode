/* eslint-disable */
import { Dispatch, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import X2JS from "x2js";
import styled from "styled-components/macro";

import deleteSrc from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import Input from "@components/common/Input";
import ValidText from "@components/common/ValidText";
import Button from "@components/common/Button";
import NoticeContainer from "@components/common/NoticeContainer";

interface parsedDataType {
  rows: {
    count: string;
    pagenum: string;
    pagesize: string;
    resultcode: string;
    row: {
      comp_nm: string;
      df: string;
      eff_prd: string;
      expired_date: string;
      inspct_org: string;
      item: string;
      mf_icm: string;
      mod_date: string;
      pkg_unit: string;
      prdt_nm: string;
      prdt_type: string;
      renew_yn: string;
      safe_sd: string;
      slfsfcfst_no: string;
      start_date: string;
      sttus: string;
      valid_yn: string;
    };
  };
  error: {
    msg: string;
    resultcode: string;
  };
}

interface SafetyModalProps {
  onClickModalHandler: Dispatch<SetStateAction<boolean>>;
  onClickCheckIsConfrim: Dispatch<SetStateAction<boolean>>;
}

const SafetyModal = ({
  onClickModalHandler,
  onClickCheckIsConfrim,
}: SafetyModalProps) => {
  const [validation, setValidation] = useState<{
    isVerified: boolean;
    isWrongNumber: boolean;
  }>({
    isVerified: false,
    isWrongNumber: false,
  });
  const { register, watch, resetField } = useFormContext();
  const watchFields = watch();
  const { validationCode } = watchFields;

  const postAuthenticationCode = async (validationCode: string) => {
    try {
      setValidation(() => ({
        isVerified: false,
        isWrongNumber: false,
      }));

      const parameter = {
        params: {
          AuthKey: process.env.REACT_APP_IDETIFICATION_AUTHENTICATION_API_KEY,
          ServiceName: "slfsfcfstChk",
          SlfsfcfstNo: validationCode,
        },
      };

      const { data } = await axios.get(
        "https://ecolife.me.go.kr/openapi/ServiceSvl?idx=13",
        parameter
      );

      const x2js = new X2JS();
      const parsedData: parsedDataType = x2js.xml2js(data);

      if (parsedData?.rows?.count === "0") {
        setValidation(() => ({
          isVerified: false,
          isWrongNumber: true,
        }));
        return;
      }

      if (parsedData?.rows?.row?.valid_yn === "N") {
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
    } catch (error) {
      console.log("error", error);
    }
  };
  const saveAuthenticationCode = () => {
    onClickCheckIsConfrim(true);
    onClickModalHandler(false);
    resetField("validationCode");
  };

  const onCancelButton = () => {
    onClickModalHandler(false);
    resetField("validationCode");
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
            <Input {...register("validationCode")} />
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
        <Button
          size="small"
          full={false}
          className={isVerified ? "positive" : "negative"}
          onClick={saveAuthenticationCode}
          disabled={!isVerified}
        >
          저장
        </Button>
        <Button size="small" full={false} onClick={onCancelButton}>
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
