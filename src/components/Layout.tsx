import styled from "styled-components";
import GlobalNavigationBar from "@components/GlobalNavigationBar";
import Footer from "@components/Footer";
import SideNavigationBar from "./SideNavigationBar";

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
`;

export default Layout;
