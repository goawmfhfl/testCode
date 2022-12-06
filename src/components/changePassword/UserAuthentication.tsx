import styled from "styled-components/macro";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { format } from "date-fns";
import { useReactiveVar } from "@apollo/client";

import Button from "@components/common/Button";
import { Medium as InputMedium } from "@components/common/input/Input";

import { preventNaNValues } from "@utils/index";
import { sendKakaoMessage } from "@utils/sendKakaoMessage";
import { systemModalVar } from "@cache/index";
import useTimer from "@hooks/useTimer";
import { inputVar, isAuthenticatedVar } from "@cache/password";
import {
  GetUserByEmailInput,
  GetUserByEmailResult,
  GET_USER_BY_EMAIL,
} from "@graphql/queries/getUserByEmail";

const UserAuthentication = () => {
  const [getUserByEmail] =
    useLazyQuery<GetUserByEmailResult, GetUserByEmailInput>(GET_USER_BY_EMAIL);

  const input = useReactiveVar(inputVar);
  const [authentication, setAuthentication] = useState({
    code: "",
    isSended: false,
  });
  const { timeLeft, isOver, reset: resetTimer } = useTimer(180);

  const handleInputChange =
    (inputName) => (e: React.ChangeEvent<HTMLInputElement>) => {
      inputVar({
        ...inputVar(),
        [inputName]: e.target.value,
      });
    };

  const handleAuthenticationButtonClick = async () => {
    const { phoneNumber } = input;

    const result = await getUserByEmail({
      variables: {
        input: {
          email: input.email,
        },
      },
    });

    const { ok, user } = result.data.getUserByEmail;

    if (!ok) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            해당 이메일을 사용하는 <br />
            유저를 찾을 수 없습니다.
          </>
        ),
      });

      return;
    }

    if (user.phoneNumber !== phoneNumber) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            등록된 계정과 전화번호가 <br />
            일치하지 않습니다. <br />
            (입점 신청서 작성 당시의 <br />
            이메일과 전화번호로 인증해주세요)
          </>
        ),
      });

      return;
    }

    const authCode = String(Math.random()).slice(2, 8);

    const response = await sendKakaoMessage(
      phoneNumber,
      `[${authCode}] 인증번호를 입력하시면 인증이 완료됩니다.`
    );

    const { code, message } = response.data[0];

    const hasRequestFailed = code === "fail";
    const isInvalidNumber =
      code === "fail" && /InvalidPhoneNumber/gi.test(message);

    if (hasRequestFailed) {
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

      return;
    }

    if (isInvalidNumber) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: <>전화번호를 올바르게 입력해주세요.</>,
      });

      return;
    }

    setAuthentication({
      isSended: true,
      code: authCode,
    });

    resetTimer(() => {
      return isAuthenticatedVar();
    });
  };

  useEffect(() => {
    // initialize system modal
    systemModalVar({
      ...systemModalVar(),
      isVisible: false,
      confirmButtonVisibility: true,
      confirmButtonText: "확인",
      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });
      },
      cancelButtonVisibility: false,
    });
  }, []);

  const hasInputFulfilled = !!input.email && !!input.phoneNumber;

  const isAuthenticated =
    input.authCode.length === 6 && input.authCode === authentication.code;
  const isAuthenticationFailed =
    input.authCode.length === 6 && input.authCode !== authentication.code;
  const isTimeOver = authentication.isSended && isOver;

  useEffect(() => {
    if (isTimeOver) {
      setAuthentication({
        isSended: true,
        code: "",
      });
    }
  }, [isTimeOver]);

  useEffect(() => {
    if (isAuthenticated) {
      isAuthenticatedVar(true);
    }
  }, [isAuthenticated]);

  return (
    <Container>
      <InputContainer>
        <InputMedium
          type="email"
          placeholder="아이디(이메일)"
          width={"244px"}
          onChange={handleInputChange("email")}
          value={input.email}
        />

        <InputWrapper>
          <InputMedium
            type="text"
            placeholder="전화번호 ‘-’없이 입력"
            width={"244px"}
            onKeyDown={preventNaNValues}
            onChange={handleInputChange("phoneNumber")}
            value={input.phoneNumber}
            maxLength={12}
          />
          <Button
            size="big"
            width="148px"
            disabled={!hasInputFulfilled}
            // eslint-disable-next-line
            onClick={handleAuthenticationButtonClick}
          >
            인증번호 발송
          </Button>
        </InputWrapper>
      </InputContainer>

      {authentication.isSended && (
        <>
          <Authentication>
            <InputMedium
              placeholder="인증번호"
              width="244px"
              maxLength={6}
              value={input.authCode}
              onChange={handleInputChange("authCode")}
              disabled={isTimeOver || isAuthenticated}
            />
            <TimeLeft>{format(timeLeft, "mm:ss")}</TimeLeft>
          </Authentication>
          <MessageContainer>
            {isAuthenticated && <Message>인증되었습니다.</Message>}
            {isAuthenticationFailed && (
              <Message invalid={true}>
                입력하신 인증번호가 올바르지 않습니다.
              </Message>
            )}
            {isTimeOver && (
              <Message invalid={true}>
                시간이 만료되었습니다. 인증번호 발송 버튼을 다시 눌러주세요.
              </Message>
            )}
          </MessageContainer>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-startt;
  justify-content: center;

  & input,
  button {
    margin-top: 8px;
  }

  & input {
    margin-right: 8px;
  }
`;

const InputContainer = styled.div``;

const InputWrapper = styled.div`
  display: flex;
`;

const MessageContainer = styled.div``;

const Message = styled.div<{ invalid?: boolean }>`
  color: ${({ invalid }) => (invalid ? "red" : "black")};
  ${({ theme }) => theme.typo.korean.body.primary.basic};
  margin-top: 8px;
`;

const Authentication = styled.div`
  display: flex;
  align-items: center;
`;

const TimeLeft = styled.div`
  width: 148px;
  ${({ theme }) => theme.typo.korean.title.secondary.basic};
  text-align: center;
`;

export default UserAuthentication;
