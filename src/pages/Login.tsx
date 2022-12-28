/* eslint-disable */
import { useState, useEffect } from "react";
import styled from "styled-components/macro";
import Layout from "@components/common/Layout";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useLazyQuery } from "@apollo/client";
import { OAuth2Client } from "google-auth-library";

import appleSrc from "@icons/apple.svg";
import kakaoSrc from "@icons/kakao.svg";
import Button from "@components/common/Button";

import { AUTH_TOKEN_KEY } from "@constants/auth";
import {
  SELLER_LOGIN,
  SellerLoginType,
  SellerLoginInputType,
} from "@graphql/mutations/sellerLogin";
import { useNavigate } from "react-router-dom";
import { Pathnames } from "@constants/index";
import { GET_SHOP_INFO } from "@graphql/queries/getShopInfo";
import { showHasServerErrorModal } from "@cache/productManagement";
import { loadingSpinnerVisibilityVar } from "@cache/index";

interface LoginFormType {
  id: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [isLoginSucceed, setIsLoginSucceed] = useState(true);
  const [isValidAuth, setIsValidAuth] = useState({
    hasNoId: false,
    hasNoPassword: false,
    isInvalid: false,
  });

  const [loginFunction, { loading: isLoginLoading, error: isLoginError }] =
    useMutation<SellerLoginType, SellerLoginInputType>(SELLER_LOGIN);

  const [getShopInfo, { loading: isShopLoading, error: isShopError }] =
    useLazyQuery(GET_SHOP_INFO, {
      fetchPolicy: "no-cache",
    });

  const { register, handleSubmit } = useForm<LoginFormType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  // useEffect(() => {
  //   if (!google) return;
  //   if (!naver) return;
  //   if (!Kakao) return;

  //   // naver oauth
  //   const naverLogin = new naver.LoginWithNaverId({
  //     clientId: "CZm3jInQ9yUhzPJCFM_j",
  //     callbackUrl:
  //       "http://" +
  //       window.location.hostname +
  //       (location.port == "" || location.port == undefined
  //         ? ""
  //         : ":" + location.port) +
  //       "/oauth/naver",
  //     isPopup: true,
  //     loginButton: { color: "green", type: 1, height: 44 },
  //   });

  //   naverLogin.init();

  //   // kakao oauth
  //   const isKakaoInitialized = Kakao.isInitialized();

  //   if (!isKakaoInitialized) {
  //     Kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);
  //   }

  //   // google oauth
  //   async function handleCredentialResponse(response: { credential: any }) {
  //     const googleClient = new OAuth2Client(
  //       process.env.REACT_APP_OAUTH_GOOGLE_CLIENT_ID
  //     );

  //     const verified = await googleClient.verifyIdToken({
  //       idToken: response.credential,
  //       audience: process.env.REACT_APP_OAUTH_GOOGLE_CLIENT_ID,
  //     });

  //     console.log(verified);
  //   }

  //   google.accounts.id.initialize({
  //     client_id: process.env.REACT_APP_OAUTH_GOOGLE_CLIENT_ID,
  //     callback: handleCredentialResponse,
  //   });

  //   google.accounts.id.renderButton(
  //     document.getElementById("google-login-button"),
  //     {
  //       theme: "filled_blue",
  //       size: "large",
  //       shape: "circle",
  //       type: "icon",
  //     }
  //   );

  //   google.accounts.id.prompt();
  // }, [google, naver, Kakao]);

  const onSubmit: SubmitHandler<LoginFormType> = async ({
    id: email,
    password,
  }) => {
    setIsValidAuth({
      hasNoId: false,
      hasNoPassword: false,
      isInvalid: false,
    });

    const { data: loginData } = await loginFunction({
      variables: {
        input: { email, password },
      },
    });

    const isLoginSucceed =
      loginData?.sellerLogin?.ok && !loginData?.sellerLogin?.error;

    setIsLoginSucceed(isLoginSucceed);

    if (isLoginSucceed) {
      window.sessionStorage.setItem(
        AUTH_TOKEN_KEY,
        loginData?.sellerLogin.token
      );

      const result = await getShopInfo();

      if (result.data.getShopInfo.error) {
        showHasServerErrorModal("", "샵 정보 가져오기");
        console.log(result);

        return;
      }

      if (result.data.getShopInfo.shop.registered) {
        navigate(Pathnames.Product);

        return;
      }

      navigate(Pathnames.Shop);
    }

    if (!isLoginSucceed) {
      console.log("로그인에 실패했습니다.");
      console.log(loginData.sellerLogin.error);
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

  const handleKakaoLoginButtonClick = async () => {
    await Kakao.Auth.login({
      scope: "",
      success: function (response: {}) {
        console.log(response);
      },
      fail: function (error: {}) {
        console.log(error);
      },
    });
  };

  useEffect(() => {
    const isLoading = isLoginLoading || isShopLoading;

    loadingSpinnerVisibilityVar(isLoading);
  }, [isLoginLoading, isShopLoading]);

  useEffect(() => {
    if (isLoginError) {
      showHasServerErrorModal("", "로그인");
      console.log(isLoginError);
      return;
    }

    if (isShopError) {
      showHasServerErrorModal("", "샵 가져오기");
      console.log(isShopError);
    }
  }, [isLoginError, isShopError]);

  const { hasNoId, hasNoPassword, isInvalid } = isValidAuth;

  return (
    <Layout hasSideNavigation={false}>
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

        {/* <SnsContainer>
          <SnsTitleWrapper>
            <SnsTitleText>SNS 간편 로그인</SnsTitleText>
          </SnsTitleWrapper>
          <IconList>
            <div id="naverIdLogin">
              <img id="naverIdLoginButton" />
            </div>
            <img src={kakaoSrc} onClick={handleKakaoLoginButtonClick} />
            <GoogleLoginButton
              id="google-login-button"
              data-type="icon"
              data-shape="circle"
              data-theme="filled_blue"
              data-text="signin_with"
              data-size="large"
            ></GoogleLoginButton>
            <img src={appleSrc} />
          </IconList>
        </SnsContainer> */}

        <FindUserContainer>
          <Link onClick={() => alert("준비중입니다.")}>
            <FindUserButton>아이디 찾기</FindUserButton>
          </Link>
          <Link href={Pathnames.Password}>
            <FindUserButton>비밀번호 변경하기</FindUserButton>
          </Link>
        </FindUserContainer>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  width: 400px;

  margin: 0 auto;
  padding: 160px 0px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
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
  margin-bottom: -14px;

  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;
  color: ${({ theme: { palette } }) => palette.red900};

  span.red-text {
    color: ${({ theme: { palette } }) => palette.red900};
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 48px;
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

const GoogleLoginButton = styled.div`
  display: grid;
  place-items: center;

  width: 44px;
  height: 44px;

  background-color: #1b72e8;
  border-radius: 50%;
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
