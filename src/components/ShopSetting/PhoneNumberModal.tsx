import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import axios from "axios";
import styled from "styled-components/macro";
import { Input as TextInput } from "@components/common/input/TextInput";
import Button from "@components/common/Button";
import ValidText from "@components/common/ValidText";
import closeIconSource from "@icons/close.svg";
import { modalVar, systemModalVar } from "@cache/index";
import { phoneNumberVar } from "@cache/shopSettings";
import { validatePhoneNumber, isNumber } from "@utils/index";

const bizm = axios.create({
  baseURL: process.env.REACT_APP_BIZM_PRODUCT_URL,
  headers: { userid: "chopsticks" },
});

const formatNumber = (number: string) => {
  return "+82" + number.slice(1);
};

const postAuthenticationCode = async (
  phoneNumber: string,
  AuthenticationCode: string
) => {
  try {
    const data = [
      {
        message_type: "AT",
        phn: formatNumber(phoneNumber),
        profile: process.env.REACT_APP_BIZM_PROFILE,
        reserveDt: "00000000000000",
        tmplId: "chopsticks_05",
        msg: `[${AuthenticationCode}] 인증번호를 입력하시면 인증이 완료됩니다.`,
      },
    ];

    const {
      data: bizmResponseData,
    }: {
      data: Array<{
        code: string;
        data: string;
        message: string;
        originMessage: string | null;
      }>;
    } = await bizm.post(`/v2/sender/send`, data);

    console.log(bizmResponseData);

    if (
      bizmResponseData[0].code === "fail" &&
      /InvalidPhoneNumber/gi.test(bizmResponseData[0].message)
    ) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: <>전화번호를 올바르게 입력해주세요.</>,
      });

      return false;
    }

    if (bizmResponseData[0].code === "fail") {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            인증 서비스에 문제가 발생하였습니다.
            <br />
            찹스틱스로 문의해주시면
            <br />
            빠르게 조치하겠습니다.
            <br />
            (문의 전화 070-4187-3848)
          </>
        ),
      });

      return false;
    }

    return true;
  } catch (error) {
    console.log("Bizm API 요청 중 에러", error);
  }
};

const PhoneNumberModal = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [expirationTime, setExpirationTime] = useState<Date>(new Date());

  const [authentication, setAuthentication] = useState<{
    isStarted: boolean;
    codeByUser: string;
    codeByService: string;
    userPhoneNumber: string;
  }>({
    isStarted: false,
    codeByUser: "",
    codeByService: "",
    userPhoneNumber: "",
  });

  const [authenticationValid, setAuthenticationValid] = useState<{
    isTimeout: boolean;
    isWrongNumber: boolean;
    isVerified: boolean;
  }>({
    isTimeout: false,
    isWrongNumber: false,
    isVerified: false,
  });

  function initializeTimer() {
    setCurrentTime(new Date());
    setExpirationTime(new Date(new Date().getTime() + 3 * 60000));
  }

  function clearModal() {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNumber(e.target.value)) {
      return;
    }

    setAuthentication((prev) => ({
      ...prev,
      userPhoneNumber: e.target.value,
    }));
  };

  const handleAuthenticationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAuthentication((prev) => ({
      ...prev,
      codeByUser: e.target.value,
    }));
  };

  const handleClickAuthenticationButton = async () => {
    setAuthenticationValid(() => ({
      isVerified: false,
      isTimeout: false,
      isWrongNumber: false,
    }));

    const randomNumber = String(Math.random()).slice(2, 8);

    const hasAuthCodePosted: boolean = await postAuthenticationCode(
      userPhoneNumber,
      randomNumber
    );

    if (!hasAuthCodePosted) {
      return;
    }

    setAuthentication((prev) => ({
      ...prev,
      codeByService: randomNumber,
      isStarted: true,
    }));

    initializeTimer();
  };

  const confirmAuthenticationCode = (AuthenticationCodeByUser: string) => {
    if (codeByService !== AuthenticationCodeByUser) {
      setAuthenticationValid(() => ({
        isVerified: false,
        isTimeout: false,
        isWrongNumber: true,
      }));
    } else {
      setAuthenticationValid(() => ({
        isVerified: true,
        isTimeout: false,
        isWrongNumber: false,
      }));
    }
  };

  const handleConfirmButtonClick = () => {
    phoneNumberVar(userPhoneNumber);

    clearModal();
  };

  const handleCancelButtonClick = () => {
    clearModal();
  };

  const { isTimeout, isWrongNumber, isVerified } = authenticationValid;
  const { isStarted, codeByUser, codeByService, userPhoneNumber } =
    authentication;

  useEffect(() => {
    if (!isStarted) return;

    const countdown = setInterval(() => {
      if (expirationTime.getTime() - currentTime.getTime() < 1000) {
        clearInterval(countdown);

        if (!isVerified) {
          setAuthenticationValid((prev) => ({
            ...prev,
            isWrongNumber: false,
            isTimeout: true,
          }));
        }

        return;
      }

      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, [currentTime, expirationTime, isStarted]);

  const isPhoneNumberValid = !(
    authentication.userPhoneNumber &&
    !validatePhoneNumber(authentication.userPhoneNumber)
  );

  return (
    <Container>
      <CloseButton src={closeIconSource} onClick={clearModal} />
      <Title>전화번호 변경하기</Title>
      <DescriptText>
        {isStarted
          ? "인증번호가 전송되었습니다. 확인해주세요."
          : "변경할 전화번호를 입력해주세요"}
      </DescriptText>

      <ConfirmContainer>
        <PhoneNumberContainer>
          <PhoneNumberInput
            placeholder="전화번호 - 제외하고 입력해주세요"
            value={userPhoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <SendAuthenticationCodeButton
            size="small"
            full={false}
            // eslint-disable-next-line
            onClick={handleClickAuthenticationButton}
            disabled={!isPhoneNumberValid}
          >
            {isStarted ? "인증번호 재전송" : "인증번호 전송"}
          </SendAuthenticationCodeButton>
        </PhoneNumberContainer>

        {!isPhoneNumberValid && (
          <ValidityNotifier>올바르지 않은 번호 형식입니다.</ValidityNotifier>
        )}

        {isStarted && (
          <AuthenticationCodeContainer>
            <AuthenticationCodeInput
              value={codeByUser}
              onChange={handleAuthenticationCodeChange}
            />
            {isVerified ? (
              <ValidText valid={isVerified}>인증완료!</ValidText>
            ) : (
              <>
                <AuthenticationButton
                  size="small"
                  full={false}
                  onClick={() => confirmAuthenticationCode(codeByUser)}
                >
                  인증
                </AuthenticationButton>
                <CounterText>
                  {format(
                    new Date(expirationTime.getTime() - currentTime.getTime()),
                    "mm:ss"
                  )}
                </CounterText>
              </>
            )}
          </AuthenticationCodeContainer>
        )}
        {isTimeout && (
          <ValidText valid={!isTimeout}>
            세션 시간이 만료되었습니다. 인증번호 재전송 버튼을 눌러 주세요.
          </ValidText>
        )}
        {isWrongNumber && (
          <ValidText valid={!isWrongNumber}>
            인증번호가 올바르지 않습니다.
            <br />
            다시 입력해주시거나 인증번호를 재전송 버튼을 눌러 주세요.
          </ValidText>
        )}
      </ConfirmContainer>

      <ButtonContainer>
        <Button
          size="small"
          full={false}
          onClick={handleConfirmButtonClick}
          disabled={!isVerified}
        >
          확인
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

const CloseButton = styled.img`
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
`;

const PhoneNumberInput = styled(TextInput)`
  width: 246px;
  margin-right: 8px;
  padding: 9px 8px;
`;

const ValidityNotifier = styled.div`
  font-family: "Spoqa Han Sans Neo";
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

const SendAuthenticationCodeButton = styled(Button)`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.1px;
`;

const AuthenticationCodeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const AuthenticationButton = styled(Button)`
  margin-right: 8px;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.1px;
`;

const AuthenticationCodeInput = styled(TextInput)`
  width: 246px;
  margin-right: 8px;
  padding: 9px 8px;
`;

const CounterText = styled.span`
  width: 30px;

  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;
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
export default PhoneNumberModal;
