import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";

import { GNBReferenceVar } from "@cache/index";
import { AUTH_TOKEN_KEY } from "@constants/auth";
import { Pathnames } from "@constants/index";

import useShopInfo from "@hooks/useShopInfo";

import logoSrc from "@images/logo-white.png";
import loginSrc from "@icons/login.svg";
import logoutSrc from "@icons/logout.svg";

const GlobalNavigationBar = () => {
  const navigate = useNavigate();

  const { data } = useShopInfo();

  const handleLoginButtonClick = () => {
    navigate(Pathnames.Login);
  };
  const handleLogoutButtonClick = () => {
    window.location.replace(Pathnames.Login);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const isLogin = data?.getShopInfo?.englishName;
  return (
    <Container
      // eslint-disable-next-line
      ref={(newRef: HTMLElement) => GNBReferenceVar(newRef)}
    >
      <LogoWrapper>
        <Logo src={logoSrc} />
      </LogoWrapper>
      <NavList>
        {isLogin ? (
          <>
            <NavItem>
              <UserName>{data?.getShopInfo?.englishName}</UserName>
            </NavItem>
            <NavItem onClick={handleLogoutButtonClick}>
              <Icon src={logoutSrc} />
              <Text>로그아웃</Text>
            </NavItem>
          </>
        ) : (
          <NavItem onClick={handleLoginButtonClick}>
            <Icon src={loginSrc} />
            <Text>로그인</Text>
          </NavItem>
        )}
      </NavList>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0px 6px 30px;
  z-index: 1000;
  background-color: ${({ theme: { palette } }) => palette.grey900};
`;

const LogoWrapper = styled.div``;
const Logo = styled.img`
  width: 118px;
  height: 21px;
`;

const NavList = styled.div`
  display: flex;
`;

const NavItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  width: 98px;
  height: 44px;
`;
const Icon = styled.img``;
const Text = styled.span`
  color: ${({ theme: { palette } }) => palette.white};
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
`;

const UserName = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;

  font-family: "Spoqa Han Sans Neo";
  font-size: 12px;
  font-weight: 300;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: center;

  color: ${({ theme: { palette } }) => palette.white};
`;

export default GlobalNavigationBar;
