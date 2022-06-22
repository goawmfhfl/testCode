import styled from "styled-components";
import Layout from "../components/Layout";

import appleSrc from "@images/apple.svg";
import naverSrc from "@icons/naver.svg";
import kakaoSrc from "@icons/kakao.svg";
import googleSrc from "@icons/google.svg";

const Login = () => {
  return (
    <Layout>
      <Container>
        <LoginContainer>
          <TitleBox>
            <LargeTypo>로그인</LargeTypo>
          </TitleBox>
          <InputBox>
            <Input placeholder="아이디" type="text" />
            <Input placeholder="비밀번호" type="password" />
            {/* <ValidText className="invalid">아이디를 입력해 주세요.</ValidText> */}
            {/* <ValidText className="invalid">비밀번호를 입력해 주세요.</ValidText> */}
            <ValidText className="invalid">
              입력된 아이디 또는 비밀번호가 올바르지 않습니다.
            </ValidText>
          </InputBox>
          <ButtonBox>
            <Button>로그인 하기</Button>
          </ButtonBox>
        </LoginContainer>
        {/* SNS 간편 로그인 */}
        <SnsContainer>
          <SubTitleWrapper>SNS 간편 로그인</SubTitleWrapper>
          <IconBox>
            <img src={naverSrc} />
            <img src={kakaoSrc} />
            <img src={googleSrc} />
            <img src={appleSrc} />
          </IconBox>
        </SnsContainer>
        {/* 아이디 찾기 비밀번호 찾기 */}
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
const TitleBox = styled.div`
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
    background-color: ${(props) => props.theme.palette["Grey500"]};
  }
`;

const LargeTypo = styled.h2`
  text-align: center;
  font-weight: 700;
`;
const InputBox = styled.div`
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

  background: ${(props) => props.theme.palette["White"]};
  border: 1px solid ${(props) => props.theme.palette["Grey500"]};
  color: ${(props) => props.theme.palette["black"]};

  &::placeholder {
    color: ${(props) => props.theme.palette["Grey500"]};
  }
  &:focus {
    border: 1px solid ${(props) => props.theme.palette["Grey700"]};
    outline: 1px solid ${(props) => props.theme.palette["Grey700"]};
  }
`;
const ValidText = styled.div``;
const ButtonBox = styled.div`
  width: 100%;
  button {
    width: 100%;
  }
`;
const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid ${(props) => props.theme.palette["Grey500"]};

  &.positive {
    background-color: ${(props) => props.theme.palette["Grey700"]};
    border: none;
    color: ${(props) => props.theme.palette["White"]};
  }
  &.negative {
    background-color: ${(props) => props.theme.palette["Grey300"]};
    border: none;
    color: ${(props) => props.theme.palette["Grey500"]};
  }
`;

// SnsContainer
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
    background-color: ${(props) => props.theme.palette["Grey300"]};
  }
`;
const SubTitleWrapper = styled.div`
  margin-bottom: 16px;
  font-weight: 400;
`;
const IconBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-bottom: 32px;

  img {
    border-radius: 22px;
  }
`;

// 회원가입 및 아이디

const FindUserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Link = styled.a`
  /* React Router DOM 적용 예정 */
  /* Link를 통한 라우팅 ? */
  /* history.push를 통한 라우팅? */
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
    background: ${(props) => props.theme.palette["Grey500"]};
    content: " ";
  }
`;

const FindUserButton = styled.button``;

export default Login;
