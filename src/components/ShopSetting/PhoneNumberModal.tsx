import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components/macro";
import Input from "@components/common/Input";
import Button from "@components/common/Button";
import ValidText from "@components/common/ValidText";
import closeIconSource from "@icons/close.svg";
import { modalVar } from "@cache/index";
import { phoneNumberVar } from "@cache/shopSettings";

const bizm = axios.create({
  baseURL: process.env.REACT_APP_BIZM_PRODUCT_URL,
  headers: { userid: "chopsticks" },
});

const formatNumber = (number: string) => {
  return "+82" + number.slice(1);
};

const postAuthenticationCode = (
  phoneNumber: string,
  AuthenticationCode: string
) => {
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

  bizm
    .post(`/v2/sender/send`, data)
    .then((result) => {
      console.log("bizm post Result", result);
    })
    .catch((error) => {
      console.log("bizm post Error", error);
    });
};

const PhoneNumberModal = () => {
  const [time, setTime] = useState<{ minutes: number; seconds: number }>({
    minutes: 0,
    seconds: 0,
  });

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

  const handleClickAuthenticationButton = () => {
    setAuthenticationValid(() => ({
      isVerified: false,
      isTimeout: false,
      isWrongNumber: false,
    }));

    const randomNumber = String(Math.random()).slice(2, 8);
    postAuthenticationCode(userPhoneNumber, randomNumber);
    setAuthentication((prev) => ({
      ...prev,
      codeByService: randomNumber,
    }));

    setAuthentication((prev) => ({ ...prev, isStarted: true }));

    setTime(() => ({
      minutes: 3,
      seconds: 0,
    }));
  };

  const turnOffModal = () =>
    modalVar({
      ...modalVar(),
      isVisible: false,
    });

  const confirmAuthenticationCode = (AuthenticationCodeByUser: any) => {
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

    turnOffModal();
  };

  const handleCancelButtonClick = () => {
    turnOffModal();
  };

  const { minutes, seconds } = time;
  const { isTimeout, isWrongNumber, isVerified } = authenticationValid;
  const { isStarted, codeByUser, codeByService, userPhoneNumber } =
    authentication;

  useEffect(() => {
    if (!isStarted) return;

    const countdown = setInterval(() => {
      if (seconds > 0) {
        setTime((prev) => ({
          ...prev,
          seconds: seconds - 1,
        }));
      }

      if (seconds !== 0) return;

      if (minutes === 0) {
        clearInterval(countdown);
        if (!isVerified) {
          setAuthenticationValid((prev) => ({
            ...prev,
            isWrongNumber: false,
            isTimeout: true,
          }));
        }
      } else {
        setTime(() => ({
          minutes: minutes - 1,
          seconds: 59,
        }));
      }
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, [minutes, seconds, isStarted]);

  return (
    <Container>
      <CloseButton src={closeIconSource} onClick={turnOffModal} />
      <Title>전화번호 변경하기</Title>
      <DescriptText>
        {isStarted
          ? "인증번호가 전송되었습니다. 확인해주세요."
          : "변경할 전화번호를 입력해주세요"}
      </DescriptText>

      <ConfirmContainer>
        <PhoneNumberContainer>
          <Input
            placeholder="전화번호 - 제외하고 입력해주세요"
            value={userPhoneNumber}
            onChange={(event) =>
              setAuthentication((prev) => ({
                ...prev,
                userPhoneNumber: event.target.value,
              }))
            }
          />
          <Button
            size="small"
            full={false}
            onClick={handleClickAuthenticationButton}
          >
            {isStarted ? "인증번호 재전송" : "인증번호 전송"}
          </Button>
        </PhoneNumberContainer>

        {isStarted && (
          <AuthenticationCodeContainer>
            <Input
              value={codeByUser}
              onChange={(event) =>
                setAuthentication((prev) => ({
                  ...prev,
                  codeByUser: event.target.value,
                }))
              }
            />
            {isVerified ? (
              <ValidText valid={isVerified}>인증완료!</ValidText>
            ) : (
              <>
                <Button
                  size="small"
                  full={false}
                  onClick={() => confirmAuthenticationCode(codeByUser)}
                >
                  인증
                </Button>
                <CounterText>
                  {minutes < 10 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
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
          className={isVerified ? "positive" : "negative"}
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

  & > p {
    margin: auto 0;
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
