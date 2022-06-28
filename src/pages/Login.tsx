/* eslint-disable */
import { useState, useEffect } from "react";
import styled from "styled-components";
import Layout from "@components/Layout";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";

import appleSrc from "@icons/apple.svg";
import kakaoSrc from "@icons/kakao.svg";
import googleSrc from "@icons/google.svg";
import Button from "@components/Button";

interface LoginFormType {
  id: string;
  password: string;
}

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ok
      error
      user {
        name
      }
      token
    }
  }
`;

const Login = () => {
  const [isLoginSucceed, setIsLoginSucceed] = useState(true);
  const [isValidAuth, setIsValidAuth] = useState({
    hasNoId: false,
    hasNoPassword: false,
    isInvalid: false,
  });

  const [loginFunction, { loading }] = useMutation(LOGIN);
  const { register, handleSubmit } = useForm<LoginFormType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    const naverLogin = new naver.LoginWithNaverId({
      clientId: "CZm3jInQ9yUhzPJCFM_j",
      callbackUrl:
        "http://" +
        window.location.hostname +
        (location.port == "" || location.port == undefined
          ? ""
          : ":" + location.port) +
        "/oauth/naver",
      isPopup: true,
      loginButton: { color: "green", type: 1, height: 44 },
    });

    naverLogin.init();
  }, []);

  const onSubmit: SubmitHandler<LoginFormType> = async ({
    id: email,
    password,
  }) => {
    setIsValidAuth({
      hasNoId: false,
      hasNoPassword: false,
      isInvalid: false,
    });

    try {
      const { data: loginData } = await loginFunction({
        variables: {
          input: { email, password },
        },
      });
      const isLoginSucceed = loginData?.login.ok && !loginData?.login.error;

      setIsLoginSucceed(isLoginSucceed);
      if (isLoginSucceed) {
        window.sessionStorage.setItem("authToken", loginData?.login.token);
        // 리다이렉션
      }
    } catch (error) {
      console.log("로그인 요청이 실패하였습니다");
    }
  };
  const onError = (errors: any) => {
    setIsLoginSucceed(true);
    setIsValidAuth({
      hasNoId: errors.id?.type === "required",
      hasNoPassword: errors.password?.type === "required",
      isInvalid: errors.id?.type === "pattern",
    });
  };

  const { hasNoId, hasNoPassword, isInvalid } = isValidAuth;

  return (
    <Layout>
      <Container>
        <LoginContainer>
          <LoginTextWrapper>
            <LoginText>로그인</LoginText>
          </LoginTextWrapper>
          <LoginForm id="login-form" onSubmit={handleSubmit(onSubmit, onError)}>
            <Input
              placeholder="아이디"
              type="text"
              {...register("id", {
                required: true,
                pattern: /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              })}
            />
            <Input
              placeholder="비밀번호"
              type="password"
              id="password"
              {...register("password", {
                required: true,
              })}
            />
            {hasNoId && <ValidText>아이디를 입력해 주세요.</ValidText>}
            {!hasNoId && hasNoPassword && (
              <ValidText>비밀번호를 입력해 주세요.</ValidText>
            )}
            {!hasNoId && !hasNoPassword && isInvalid && (
              <ValidText>
                아이디(이메일)형식이 올바르지 않습니다. 아이디를 다시
                확인해주세요.
              </ValidText>
            )}
            {!isLoginSucceed && (
              <ValidText>
                입력된 아이디 또는 비밀번호가 올바르지 않습니다.
              </ValidText>
            )}
            <ButtonWrapper>
              <Button
                className="positive"
                size={"big"}
                full={true}
                type="submit"
              >
                로그인 하기
              </Button>
            </ButtonWrapper>
          </LoginForm>
        </LoginContainer>
        <SnsContainer>
          <SnsTitleWrapper>
            <SnsTitleText>SNS 간편 로그인</SnsTitleText>
          </SnsTitleWrapper>
          <IconList>
            <div id="naverIdLogin">
              <img id="naverIdLoginButton" />
            </div>
            <img src={kakaoSrc} />
            <img src={googleSrc} />
            <img src={appleSrc} />
          </IconList>
        </SnsContainer>
        <FindUserContainer>
          <Link>
            <FindUserButton>아이디 찾기</FindUserButton>
          </Link>
          <Link>
            <FindUserButton>비밀번호 찾기</FindUserButton>
          </Link>
        </FindUserContainer>
      </Container>
    </Layout>
  );
};

const Container = styled.main`
  margin: 0 auto;
  width: 400px;
  padding: 160px 0px;
`;
const LoginContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;
const LoginTextWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 42px;
  margin-bottom: 24px;
  &:before {
    position: absolute;
    content: "";
    height: 2px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: ${({ theme: { palette } }) => palette.grey500};
  }
`;
const LoginText = styled.h2`
  text-align: center;
  font-weight: 700;
  font-size: 25px;
  line-height: 24px;

  text-align: center;
  letter-spacing: -0.015em;
`;
const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 40px;
  input {
    margin-bottom: 8px;
  }
`;
const Input = styled.input`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px;
  background: ${({ theme: { palette } }) => palette.white};
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  color: ${({ theme: { palette } }) => palette.black};

  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  letter-spacing: -0.015em;

  &::placeholder {
    color: ${({ theme: { palette } }) => palette.grey500};
  }
  &:focus {
    border: 1px solid ${({ theme: { palette } }) => palette.grey700};
    outline: 1px solid ${({ theme: { palette } }) => palette.grey700};
  }
`;
const ValidText = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;
  color: ${({ theme: { palette } }) => palette.red900};

  margin-bottom: -14px;

  span.red-text {
    color: ${({ theme: { palette } }) => palette.red900};
  }
`;
const ButtonWrapper = styled.div`
  margin-top: 48px;
  width: 100%;
`;
const SnsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  &:before {
    position: absolute;
    content: "";
    height: 2px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: ${({ theme: { palette } }) => palette.grey300};
  }
`;
const SnsTitleWrapper = styled.div`
  margin-bottom: 16px;
`;
const SnsTitleText = styled.h2`
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;
`;
const IconList = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-bottom: 32px;
  img {
    border-radius: 22px;
  }
`;
const FindUserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 35px;
`;
const Link = styled.a`
  position: relative;
  display: inline-block;
  padding: 0 16px;

  &:nth-child(2)::before {
    display: inline-block;
    position: absolute;
    top: 1px;
    left: 0;
    width: 1px;
    height: 14px;
    background-color: ${({ theme: { palette } }) => palette.grey500};
    content: " ";
  }
`;
const FindUserButton = styled.button`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;
`;

export default Login;
