import styled from "styled-components";

import GlobalNavigationBar from "./GlobalNavigationBar";
import SideNavigationBar from "./SideNavigationBar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Container>
      <GlobalNavigationBar />
      <SideNavigationBar />
      <ContentsContainer>
        <ContentsWrapper>{children}</ContentsWrapper>
        <Footer />
      </ContentsContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  min-height: 100vh;
`;
const ContentsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 210px;
  margin-top: 56px;
`;
const ContentsWrapper = styled.div`
  flex: 1;

  padding: 16px 24px;
`;

export default Layout;
