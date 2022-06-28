import { useEffect } from "react";
import styled from "styled-components";

const OAuth = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const naverLogin = new naver.LoginWithNaverId({
      clientId: "CZm3jInQ9yUhzPJCFM_j",
      callbackUrl: "http://localhost:3000/oauth/naver",
      isPopup: true,
      callbackHandle: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    naverLogin.init();

    console.log(naverLogin);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const accessToken = naverLogin.accessToken.accessToken as string;

    console.log(accessToken);

    if (!accessToken) {
      console.log("액세스 토큰을 받아오는 것에 실패하였습니다");
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      // TODO: accessToken과 함께 서버로 로그인 요청
    })();

    // window.close();
  }, []);

  return <Container></Container>;
};

const Container = styled.div``;

export default OAuth;
