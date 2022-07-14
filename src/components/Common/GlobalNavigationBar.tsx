import styled from "styled-components";

import logoSrc from "@images/logo-white.png";
import loginSrc from "@icons/login.svg";
import applySrc from "@icons/apply.svg";

const GlobalNavigationBar = () => {
  return (
    <Container>
      <LogoWrapper>
        <Logo src={logoSrc} />
      </LogoWrapper>
      <NavList>
        <NavItem>
          <Icon src={applySrc} />
          <Text>입점신청</Text>
        </NavItem>
        <NavItem>
          <Icon src={loginSrc} />
          <Text>로그인</Text>
        </NavItem>
      </NavList>
    </Container>
  );
};

const Container = styled.header`
  width: 100%;

  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 30px 6px 30px;
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
  padding: 0px 26px;
  gap: 6px;
`;
const Icon = styled.img``;
const Text = styled.span`
  color: ${({ theme: { palette } }) => palette["grey500"]};
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
`;

export default GlobalNavigationBar;
