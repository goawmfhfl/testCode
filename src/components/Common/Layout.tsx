import styled from "styled-components";

import GlobalNavigationBar from "@components/common/GlobalNavigationBar";
import SideNavigationBar from "@components/common/SideNavigationBar";
import Footer from "@components/common/Footer";
import SaveBar from "@components/common/SaveBar";

interface LayoutProps {
  hasSaveBar?: boolean;
  children: React.ReactNode;
}

const Layout = ({ children, hasSaveBar }: LayoutProps) => {
  return (
    <Container hasSaveBar={hasSaveBar}>
      <GlobalNavigationBar />
      <SideNavigationBar />
      <ContentsContainer>
        <ContentsWrapper>{children}</ContentsWrapper>
        <Footer />
      </ContentsContainer>
      {hasSaveBar && <SaveBar />}
    </Container>
  );
};

const Container = styled.div<{ hasSaveBar: boolean | undefined }>`
  display: flex;
  flex-direction: column;

  min-height: 100vh;
  margin-bottom: ${({ hasSaveBar }) => (hasSaveBar ? "72px" : "")}; ;
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
