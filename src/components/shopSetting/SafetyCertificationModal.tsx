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
      console.log("???????????????????????? ?????? ?????? ?????? ??????", error);
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
      description: <>??????????????? ?????????????????????.</>,
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

      <Title>???????????? ?????? ?????? ?????? ???????????? ????????????</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"458px"}>
        ??????, ?????????/?????????????????? ?????? ????????? ???????????? ?????? ????????? ???????????????{" "}
        <br />
        ???????????? ??? ????????????.
      </NoticeContainer>
      <ConfirmContainer>
        <Label>???????????? ?????? ?????? ?????? ????????????</Label>
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
              ??????
            </AuthenticationButton>
          </RegisterInput>

          <AuthenticationStatus>
            {isValidationLoading ? (
              <AuthenticationLoader />
            ) : (
              <>
                {isVerified && (
                  <ValidText valid={isVerified}>?????????????????????.</ValidText>
                )}

                {(isVerified === false || isWrongNumber) && (
                  <ValidText valid={false}>
                    ???????????? ?????? ?????? ?????????. ?????? ??????????????????.
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
          ??????
        </Button>
        <Button size="small" full={false} onClick={handleCancelButtonClick}>
          ??????
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
