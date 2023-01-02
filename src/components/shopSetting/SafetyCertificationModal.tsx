import React, { useState } from "react";
import styled from "styled-components/macro";
import { useLazyQuery } from "@apollo/client";

import closeIconSource from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import ValidText from "@components/common/ValidText";
import Button from "@components/common/Button";
import NoticeContainer from "@components/common/NoticeContainer";
import { modalVar, systemModalVar } from "@cache/index";
import { safetyCertificationVar } from "@cache/shopSettings";
import AuthenticationLoader from "@components/shopSetting/AuthenticationLoader";
import { Input as TextInput } from "@components/common/input/TextInput";
import { VALIDATE_SAFETY_NUMBER } from "@graphql/queries/validateSafetyNumber";
import {
  evaluateSafetyCertificationResponse,
  parseXMLString,
} from "@utils/shopSettings/safetyCertification";

const SafetyModal = () => {
  const [validateSafetyNumber, { loading: isValidationLoading }] =
    useLazyQuery<{
      validateSafetyNumber: {
        ok: boolean;
        error: string | null;
        data: string;
      };
    }>(VALIDATE_SAFETY_NUMBER, {
      fetchPolicy: "no-cache",
    });

  const [validation, setValidation] = useState<{
    isVerified: boolean | null;
    isWrongNumber: boolean;
  }>({
    isVerified: null,
    isWrongNumber: false,
  });

  const [safetyInformation, setSafetyInformation] = useState<{
    safetyNumber: string;
    safetyExpiredDate: string;
    isAuthenticated: boolean;
  }>({
    safetyNumber: "",
    safetyExpiredDate: "",
    isAuthenticated: false,
  });

  const handleSafetyNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSafetyInformation((prev) => ({
      ...prev,
      safetyNumber: e.target.value,
    }));
  };

  const unAuthenticateSafetyInformation = () => {
    setSafetyInformation((prev) => {
      return {
        ...prev,
        isAuthenticated: false,
      };
    });
  };

  const initializeSafetyInformation = () => {
    setSafetyInformation({
      safetyNumber: "",
      safetyExpiredDate: "",
      isAuthenticated: false,
    });
  };

  const handleAuthenticationButtonClick = async (safetyNumber: string) => {
    unAuthenticateSafetyInformation();

    try {
      const result = await validateSafetyNumber({
        variables: {
          input: {
            safetyNumber,
          },
        },
      });

      const { data: xmlResponseDataString } = result.data.validateSafetyNumber;
      const parsed = parseXMLString(xmlResponseDataString);

      const { hasNoData, hasWrongAuthenticationNumber } =
        evaluateSafetyCertificationResponse(parsed);

      if (hasNoData) {
        setValidation({
          isVerified: false,
          isWrongNumber: false,
        });

        return;
      }

      if (hasWrongAuthenticationNumber) {
        setValidation({
          isVerified: false,
          isWrongNumber: true,
        });

        return;
      }

      setSafetyInformation((prev) => ({
        ...prev,
        safetyExpiredDate: parsed.rows?.row.expired_date,
      }));

      setValidation(() => ({
        isVerified: true,
        isWrongNumber: false,
      }));
    } catch (error) {
      console.log("안전확인대상번호 인증 도중 에러 발생", error);
    }
  };

  const handleSaveButtonClick = ({
    safetyNumber,
    safetyExpiredDate,
  }: {
    safetyNumber: string;
    safetyExpiredDate: string;
  }) => {
    safetyCertificationVar({
      isConfirmed: true,
      safetyAuthenticationNumber: safetyNumber,
      safetyAuthenticationExpiredDate: safetyExpiredDate,
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

        initializeSafetyInformation();
      },
      cancelButtonVisibility: false,
    });
  };

  const handleCancelButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });

    initializeSafetyInformation();
  };

  const { safetyNumber, safetyExpiredDate } = safetyInformation;
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
        캔들, 디퓨저/룸스프레이는 검사 인증을 완료해야 상품 등록시 카테고리를{" "}
        <br />
        선택하실 수 있습니다.
      </NoticeContainer>
      <ConfirmContainer>
        <Label>안전기준 적합 확인 검사 신고번호</Label>
        <RegisterContainer>
          <RegisterInput>
            <InputContainer>
              <SafetyNumberInput
                onChange={handleSafetyNumberInputChange}
                value={safetyNumber}
                placeholder={"AB12-34-5678"}
              />
            </InputContainer>

            <AuthenticationButton
              size="small"
              full={false}
              // eslint-disable-next-line
              onClick={async (e) => {
                e.preventDefault();

                await handleAuthenticationButtonClick(safetyNumber);
              }}
              disabled={isValidationLoading}
            >
              인증
            </AuthenticationButton>
          </RegisterInput>

          <AuthenticationStatus>
            {isValidationLoading ? (
              <AuthenticationLoader />
            ) : (
              <>
                {isVerified && (
                  <ValidText valid={isVerified}>인증되었습니다.</ValidText>
                )}

                {(isVerified === false || isWrongNumber) && (
                  <ValidText valid={false}>
                    존재하지 않는 번호 입니다. 다시 확인해주세요.
                  </ValidText>
                )}
              </>
            )}
          </AuthenticationStatus>
        </RegisterContainer>
      </ConfirmContainer>

      <ButtonContainer>
        <Button
          size="small"
          full={false}
          className="positive"
          onClick={() =>
            handleSaveButtonClick({
              safetyNumber,
              safetyExpiredDate,
            })
          }
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

  cursor: pointer;
  user-select: none;
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

const RegisterContainer = styled.div``;

const RegisterInput = styled.div`
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

  user-select: none;
`;

const AuthenticationStatus = styled.div`
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
