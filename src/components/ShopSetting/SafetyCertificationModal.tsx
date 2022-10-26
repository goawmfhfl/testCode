/* eslint-disable */
import React, { useState } from "react";
import axios from "axios";
import X2JS from "x2js";
import styled from "styled-components/macro";

import closeIconSource from "@icons/close.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import ValidText from "@components/common/ValidText";
import Button from "@components/common/Button";
import NoticeContainer from "@components/common/NoticeContainer";
import { modalVar, systemModalVar } from "@cache/index";
import { safetyCertificationVar } from "@cache/shopSettings";
import AuthenticationLoader from "@components/shopSetting/AuthenticationLoader";
import { Input as TextInput } from "@components/common/input/TextInput";

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

const SafetyModal = () => {
  const [validation, setValidation] = useState<{
    isVerified: boolean;
    isWrongNumber: boolean;
  }>({
    isVerified: false,
    isWrongNumber: false,
  });
  const [safetyInformation, setSafetyInformation] = useState<{
    safetyNumber: string;
    safetyExpiredDate: string;
  }>({
    safetyNumber: "",
    safetyExpiredDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { safetyNumber, safetyExpiredDate } = safetyInformation;

  const handleSafetyNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSafetyInformation((prev) => ({
      ...prev,
      safetyNumber: e.target.value,
    }));
  };

  const handleAuthenticationButtonClick = async () => {
    try {
      const parameter = {
        params: {
          AuthKey: process.env.REACT_APP_ECOLIFE_API_KEY,
          ServiceName: "slfsfcfstChk",
          SlfsfcfstNo: safetyNumber,
        },
      };

      setIsLoading(true);

      const { data } = await axios.get(
        "https://ecolife.me.go.kr/openapi/ServiceSvl?idx=13",
        parameter
      );

      const x2js = new X2JS();
      const parsedData: parsedDataType = x2js.xml2js(data);

      const hasNoData = parsedData?.rows?.count === "0";
      const hasWrongAuthenticationNumber =
        parsedData?.rows?.row?.valid_yn === "N";

      if (hasNoData || hasWrongAuthenticationNumber) {
        setValidation(() => ({
          isVerified: false,
          isWrongNumber: true,
        }));

        return;
      }

      setSafetyInformation((prev) => ({
        ...prev,
        safetyExpiredDate: parsedData.rows.row.expired_date,
      }));

      setValidation(() => ({
        isVerified: true,
        isWrongNumber: false,
      }));
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSaveButtonClick = () => {
    safetyCertificationVar({
      isConfirmed: true,
      safetyAuthenticationNumber: safetyNumber,
      safetyAuthenticationExpiredDate: safetyExpiredDate,
    });

    setSafetyInformation({
      safetyNumber: "",
      safetyExpiredDate: null,
    });

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>인증사항이 저장되었습니다.</>,
      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });

        modalVar({
          ...modalVar(),
          isVisible: false,
        });
      },
      cancelButtonVisibility: false,
    });
  };

  const handleCancelButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });

    setSafetyInformation({
      safetyNumber: "",
      safetyExpiredDate: null,
    });
  };

  const { isVerified, isWrongNumber } = validation;

  return (
    <Container>
      <Icon
        src={closeIconSource}
        onClick={() =>
          modalVar({
            ...modalVar(),
            isVisible: false,
          })
        }
      />
      <Title>안전기준 적합 확인 검사 신고번호 인증하기</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"458px"}>
        캔들, 디퓨저 판매 창작자는 검사 인증을 완료해야 상품 등록시 카테고리
        설정에서
        <br />
        캔들, 디퓨저를 선택하실 수 있습니다.
      </NoticeContainer>
      <ConfirmContainer>
        <Label>안전기준 적합 확인 검사 신고번호</Label>
        <RegisterContainer>
          <InputContainer>
            <>
              <SafetyNumberInput
                onChange={handleSafetyNumberInputChange}
                value={safetyNumber}
              />
              <AuthenticationStatus>
                {isLoading ? (
                  <AuthenticationLoader />
                ) : (
                  <>
                    {isVerified && (
                      <ValidText valid={isVerified}>인증되었습니다.</ValidText>
                    )}
                    {isWrongNumber && (
                      <ValidText valid={!isWrongNumber}>
                        존재하지 않는 번호 입니다. 다시 확인해주세요.
                      </ValidText>
                    )}
                  </>
                )}
              </AuthenticationStatus>
            </>
          </InputContainer>

          <AuthenticationButton
            size="small"
            full={false}
            // eslint-disable-next-line
            onClick={async () => {
              await handleAuthenticationButtonClick();
              setIsLoading(false);
            }}
            disabled={isLoading}
          >
            인증
          </AuthenticationButton>
        </RegisterContainer>
      </ConfirmContainer>

      <ButtonContainer>
        <Button
          size="small"
          full={false}
          className="positive"
          onClick={handleSaveButtonClick}
          disabled={!isVerified}
        >
          저장
        </Button>
        <Button size="small" full={false} onClick={handleCancelButtonClick}>
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

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 530px;
  padding: 24px 48px 24px 24px;
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
  align-items: flex-start;
  margin-bottom: 58px;

  & > :first-child {
    margin-right: 16px;
  }
`;

const Label = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
  white-space: nowrap;

  margin-top: 8px;
`;

const RegisterContainer = styled.div`
  display: flex;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;

  position: relative;
`;

const SafetyNumberInput = styled(TextInput)`
  padding: 9px 8px;
  width: 168px;
  margin-right: 16px;
`;

const AuthenticationButton = styled(Button)`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.1px;
`;

const AuthenticationStatus = styled.span`
  margin-top: 8px;
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
